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

    // =====================================
    // CREATE FORM
    // =====================================

    public async Task<FormResponseDTO> CreateFormAsync(
        CreateFormDTO dto
    )
    {
        var form = new FeedbackForm
        {
            Id = Guid.NewGuid(),

            Title = dto.Title,

            Description = dto.Description,

            CreatedAt = DateTime.UtcNow,

            Questions = dto.Questions.Select(q =>
                new Question
                {
                    Id = Guid.NewGuid(),

                    Text = q.Text,

                    Type = q.Type,

                    Note = q.Note,

                    MetadataJson = q.MetadataJson,

                    Options = q.Options.Select(o =>
                        new Option
                        {
                            Id = Guid.NewGuid(),

                            Value = o
                        }).ToList()
                }).ToList()
        };

        await _context.FeedbackForms.AddAsync(form);

        await _context.SaveChangesAsync();

        return new FormResponseDTO
        {
            Id = form.Id,

            Title = form.Title,

            Description = form.Description,

            Questions = form.Questions.Select(q =>
                new QuestionDTO
                {
                    Id = q.Id.ToString(),

                    Text = q.Text,

                    Type = q.Type.ToString(),

                    Note = q.Note,

                    MetadataJson = q.MetadataJson,

                    Options = q.Options
                        .Select(o => o.Value)
                        .ToList()

                }).ToList()
        };
    }

    // =====================================
    // GET FORM
    // =====================================

    public async Task<FormResponseDTO> GetFormAsync(Guid id)
    {
        var form = await _context.FeedbackForms

            .Include(f => f.Questions)

            .ThenInclude(q => q.Options)

            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            return null;

        return new FormResponseDTO
        {
            Id = form.Id,

            Title = form.Title,

            Description = form.Description,

            Questions = form.Questions.Select(q =>
                new QuestionDTO
                {
                    Id = q.Id.ToString(),

                    Text = q.Text,

                    Type = q.Type.ToString(),

                    Note = q.Note,

                    MetadataJson = q.MetadataJson,

                    Options = q.Options
                        .Select(o => o.Value)
                        .ToList()

                }).ToList()
        };
    }

    // =====================================
    // UPDATE FORM
    // =====================================

    public async Task<FormResponseDTO> UpdateFormAsync(
        Guid id,
        UpdateFormDTO dto
    )
    {
        var form = await _context.FeedbackForms

            .Include(f => f.Questions)

            .ThenInclude(q => q.Options)

            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            return null;

        form.Title = dto.Title;

        form.Description = dto.Description;

        await _context.SaveChangesAsync();

        return new FormResponseDTO
        {
            Id = form.Id,

            Title = form.Title,

            Description = form.Description
        };
    }

    // =====================================
    // DELETE FORM
    // =====================================

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

    // =====================================
    // GET ALL FORMS
    // =====================================

    public async Task<List<FormResponseDTO>> GetAllFormsAsync()
    {
        var forms = await _context.FeedbackForms

            .Include(f => f.Questions)

            .ThenInclude(q => q.Options)

            .ToListAsync();

        return forms.Select(form =>
            new FormResponseDTO
            {
                Id = form.Id,

                Title = form.Title,

                Description = form.Description,

                Questions = form.Questions.Select(q =>
                    new QuestionDTO
                    {
                        Id = q.Id.ToString(),

                        Text = q.Text,

                        Type = q.Type.ToString(),

                        Note = q.Note,

                        MetadataJson = q.MetadataJson,

                        Options = q.Options
                            .Select(o => o.Value)
                            .ToList()

                    }).ToList()
            }).ToList();
    }
}