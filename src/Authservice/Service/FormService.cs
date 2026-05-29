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
    if (dto == null)
        throw new Exception("Request body is empty");

    if (string.IsNullOrWhiteSpace(dto.Title))
        throw new Exception("Form title is required");

    if (dto.Questions == null || dto.Questions.Count == 0)
        throw new Exception("At least one question is required");

    // 🔥 STEP 1: CREATE FORM FIRST
    var form = new FeedbackForm
    {
        Id = Guid.NewGuid(),
        Title = dto.Title.Trim(),
        Description = dto.Description,
        CreatedAt = DateTime.UtcNow,
        Questions = new List<Question>()
    };

    // 🔥 STEP 2: ADD QUESTIONS
    form.Questions = dto.Questions.Select(q => new Question
    {
        Id = Guid.NewGuid(),

        Text = string.IsNullOrWhiteSpace(q.Text)
            ? throw new Exception("Question text is required")
            : q.Text.Trim(),

        Type = ParseQuestionType(q.Type),

        FeedbackFormId = form.Id,   // 🔥 IMPORTANT FIX

        Note = q.Note,
        MetadataJson = q.MetadataJson,

        Options = (q.Options ?? new List<string>())
            .Where(o => !string.IsNullOrWhiteSpace(o))
            .Select(o => new Option
            {
                Id = Guid.NewGuid(),
                Value = o.Trim()
            })
            .ToList()

    }).ToList();

    // 🔥 STEP 3: SAVE
    _context.FeedbackForms.Add(form);

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine("🔥 SAVE FAILED: " + ex.Message);
        Console.WriteLine("🔥 INNER: " + ex.InnerException?.Message);
        throw;
    }

    return MapToResponse(form);
}

    // =========================
    // ENUM PARSER (SAFE)
    // =========================
    private QuestionType ParseQuestionType(object type)
    {
        if (type == null)
            throw new Exception("Question type is required");

        // numeric enum support
        if (int.TryParse(type.ToString(), out int intVal))
        {
            if (Enum.IsDefined(typeof(QuestionType), intVal))
                return (QuestionType)intVal;

            throw new Exception($"Invalid question type value: {intVal}");
        }

        var str = type.ToString()?.Trim()?.ToLower();

        return str switch
        {
            "text" => QuestionType.Text,
            "mcq" => QuestionType.MCQ,
            "dropdown" => QuestionType.Dropdown,
            _ => throw new Exception($"Invalid question type: {type}")
        };
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

        if (form == null) return null;

        return MapToResponse(form);
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
    // UPDATE FORM
    // =========================
    public async Task<FormResponseDTO?> UpdateFormAsync(Guid id, UpdateFormDTO dto)
    {
        var form = await _context.FeedbackForms
            .Include(f => f.Questions)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            return null;

        form.Title = dto.Title?.Trim();
        form.Description = dto.Description;

        await _context.SaveChangesAsync();

        return MapToResponse(form);
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

        _context.FeedbackForms.Remove(form);
        await _context.SaveChangesAsync();

        return true;
    }

    // =========================
    // RESPONSE MAPPER
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
                Note = q.Note,
                MetadataJson = q.MetadataJson,
                Options = q.Options?.Select(o => o.Value).ToList() ?? new List<string>()
            }).ToList() ?? new List<QuestionDTO>()
        };
    }
}