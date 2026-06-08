using Authservice.Data;
using Authservice.DTOs.Form;
using Authservice.Models;
using Microsoft.EntityFrameworkCore;

namespace Authservice.Service;

public class FormService : IFormService
{
    private readonly AppDbContext _context;

    public FormService(AppDbContext context)
    {
        _context = context;
    }

    // =========================
    // CREATE FORM
    // =========================
    public async Task<FormResponseDTO> CreateFormAsync(CreateFormDTO dto)
    {
        var form = new FeedbackForm
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        var questions = dto.Questions.Select(q => new Question
        {
            Id = Guid.NewGuid(),
            Text = q.Text,
            Type = q.Type,
            FeedbackFormId = form.Id,
            Options = q.Options?.Select((o, index) => new Option
            {
                Id = Guid.NewGuid(),
                Value = o,
                SortOrder = index   // ✅ FIX ADDED
            }).ToList()
        }).ToList();

        form.Questions = questions;

        _context.FeedbackForms.Add(form);
        await _context.SaveChangesAsync();

        return MapToResponse(form);
    }

    // =========================
    // GET FORM
    // =========================
    public async Task<FormResponseDTO?> GetFormAsync(Guid id)
    {
        var form = await _context.FeedbackForms
            .Include(f => f.Questions)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(f => f.Id == id);

        return form == null ? null : MapToResponse(form);
    }

    // =========================
    // GET ALL FORMS
    // =========================
    public async Task<List<FormResponseDTO>> GetAllFormsAsync()
    {
        var forms = await _context.FeedbackForms
            .Include(f => f.Questions)
            .ThenInclude(q => q.Options)
            .ToListAsync();

        return forms.Select(MapToResponse).ToList();
    }

    // =========================
    // DELETE FORM
    // =========================
    public async Task<bool> DeleteFormAsync(Guid id)
    {
        var form = await _context.FeedbackForms
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            return false;

        var feedbacks = await _context.Feedbacks
            .Where(f => f.FormId == id)
            .Include(f => f.Answers)
            .ToListAsync();

        var answers = feedbacks
            .SelectMany(f => f.Answers)
            .ToList();

        _context.Answers.RemoveRange(answers);

        _context.Feedbacks.RemoveRange(feedbacks);

        var questions = await _context.Questions
            .Where(q => q.FeedbackFormId == id)
            .ToListAsync();

        var questionIds = questions.Select(q => q.Id).ToList();

        var options = await _context.Options
            .Where(o => questionIds.Contains(o.QuestionId))
            .ToListAsync();

        _context.Options.RemoveRange(options);

        _context.Questions.RemoveRange(questions);

        _context.FeedbackForms.Remove(form);

        await _context.SaveChangesAsync();

        return true;
    }

    // =========================
    // UPDATE FORM
    // =========================
    public async Task<FormResponseDTO?> UpdateFormAsync(Guid id, UpdateFormDTO dto)
    {
        var form = await _context.FeedbackForms
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null) return null;

        form.Title = dto.Title;
        form.Description = dto.Description;

        var questions = await _context.Questions
            .Where(q => q.FeedbackFormId == id)
            .ToListAsync();

        var questionIds = questions.Select(q => q.Id).ToList();

        var options = await _context.Options
            .Where(o => questionIds.Contains(o.QuestionId))
            .ToListAsync();

        _context.Options.RemoveRange(options);
        _context.Questions.RemoveRange(questions);

        await _context.SaveChangesAsync();

        var newQuestions = dto.Questions?.Select(q => new Question
        {
            Id = Guid.NewGuid(),
            Text = q.Text,
            Type = q.Type,
            FeedbackFormId = id,
            Options = q.Options?.Select((o, index) => new Option
            {
                Id = Guid.NewGuid(),
                Value = o,
                SortOrder = index   // ✅ FIX ADDED
            }).ToList()
        }).ToList();

        if (newQuestions != null)
        {
            _context.Questions.AddRange(newQuestions);
        }

        await _context.SaveChangesAsync();

        var updated = await _context.FeedbackForms
            .Include(f => f.Questions)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(f => f.Id == id);

        return MapToResponse(updated);
    }

    // =========================
    // GET AVAILABLE FORMS
    // =========================
    public async Task<List<FormResponseDTO>> GetAvailableFormsAsync(string email)
    {
        var filledFormIds = await _context.Feedbacks
            .Where(f => f.Email == email)
            .Select(f => f.FormId)
            .ToListAsync();

        var forms = await _context.FeedbackForms
            .Include(f => f.Questions)
            .ThenInclude(q => q.Options)
            .Where(f => !filledFormIds.Contains(f.Id))
            .ToListAsync();

        return forms.Select(MapToResponse).ToList();
    }

    // =========================
    // GET FILLED FORMS
    // =========================
    public async Task<List<FormResponseDTO>> GetFilledFormsAsync(string email)
    {
        var filledFormIds = await _context.Feedbacks
            .Where(f => f.Email == email)
            .Select(f => f.FormId)
            .ToListAsync();

        var forms = await _context.FeedbackForms
            .Include(f => f.Questions)
            .ThenInclude(q => q.Options)
            .Where(f => filledFormIds.Contains(f.Id))
            .ToListAsync();

        return forms.Select(MapToResponse).ToList();
    }

    // =========================
    // GET USER DASHBOARD STATS
    // =========================
    public async Task<object> GetUserStatsAsync(string email)
    {
        var filled = await _context.Feedbacks
            .Where(f => f.Email == email)
            .Select(f => f.FormId)
            .Distinct()
            .ToListAsync();

        var available = await _context.FeedbackForms
            .CountAsync(f => !filled.Contains(f.Id));

        return new
        {
            availableForms = available,
            submittedForms = filled.Count
        };
    }

    // =========================
    // MAPPER (ONLY FIX HERE)
    // =========================
    private FormResponseDTO MapToResponse(FeedbackForm form)
    {
        return new FormResponseDTO
        {
            Id = form.Id,
            Title = form.Title,
            Description = form.Description,
            Questions = form.Questions?.Select(q => new QuestionDTO
            {
                Id = q.Id.ToString(),
                Text = q.Text,
                Type = q.Type.ToString(),

                Options = q.Options?
                    .OrderBy(o => o.SortOrder)   // ✅ FIX ADDED
                    .Select(o => o.Value)
                    .ToList()
            }).ToList()
        };
    }
}