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
            CreatedAt = DateTime.UtcNow,
            Questions = new List<Question>()
        };

        form.Questions = dto.Questions.Select(q => new Question
        {
            Id = Guid.NewGuid(),
            Text = q.Text,
            Type = ParseQuestionType(q.Type),
            FeedbackFormId = form.Id,
            Options = q.Options?.Select(o => new Option
            {
                Id = Guid.NewGuid(),
                Value = o
            }).ToList()
        }).ToList();

        _context.FeedbackForms.Add(form);
        await _context.SaveChangesAsync();

        return MapToResponse(form);
    }

    // =========================
    // AVAILABLE FORMS (USER)
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
    // FILLED FORMS (USER)
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
    // USER STATS
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
    // DELETE FORM
    // =========================
    public async Task<bool> DeleteFormAsync(Guid id)
    {
        var feedbacks = await _context.Feedbacks
            .Where(f => f.FormId == id)
            .ToListAsync();

        _context.Feedbacks.RemoveRange(feedbacks);

        var form = await _context.FeedbackForms
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            return false;

        _context.FeedbackForms.Remove(form);
        await _context.SaveChangesAsync();

        return true;
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
    // UPDATE FORM
    // =========================
    public async Task<FormResponseDTO?> UpdateFormAsync(Guid id, UpdateFormDTO dto)
    {
        var form = await _context.FeedbackForms
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            return null;

        form.Title = dto.Title;
        form.Description = dto.Description;

        await _context.SaveChangesAsync();

        return MapToResponse(form);
    }

    // =========================
    // MAPPER
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
                Options = q.Options?.Select(o => o.Value).ToList()
            }).ToList()
        };
    }

    private QuestionType ParseQuestionType(object type)
    {
        return Enum.TryParse<QuestionType>(type.ToString(), true, out var result)
            ? result
            : QuestionType.Text;
    }
}