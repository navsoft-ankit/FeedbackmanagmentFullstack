using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Authservice.Data;
using Authservice.Models;
using Authservice.DTOs.Form;
using Microsoft.EntityFrameworkCore;
namespace Authservice.Controllers;

[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly AppDbContext _context;

    public FeedbackController(
        AppDbContext context
    )
    {
        _context = context;
    }

    // ================ SUBMIT FEEDBACK ================
    [Authorize]
    [HttpPost("submit")]
    public async Task<IActionResult>
    SubmitFeedback(
        [FromBody]
        SubmitFeedbackDTO dto
    )
    {
        // ================ GET LOGGED-IN USER ================
        var email =
            User.FindFirst(
                ClaimTypes.Email
            )?.Value;

        var name =
            User.FindFirst(
                ClaimTypes.Name
            )?.Value;

        if (string.IsNullOrEmpty(email))
        {
            return Unauthorized(
                "Invalid token"
            );
        }

        // ================ CHECK DUPLICATE ================
        var alreadySubmitted =
            await _context.Feedbacks
            .AnyAsync(f =>
                f.FormId == dto.FormId &&
                f.Email == email
            );

        if (alreadySubmitted)
        {
            return BadRequest(
                "Feedback already submitted"
            );
        }

        // ================ CREATE FEEDBACK ================
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var feedback = new Feedback
        {
            FormId = dto.FormId,
            // UserId = Guid.Parse(userId),

            Name = name,

            Email = email,

            Designation =
                dto.Designation,

            FinalNote =
                dto.FinalNote,

            Answers =
                dto.Answers.Select(a =>
                    new Answer
                    {
                        QuestionId =
                            a.QuestionId,

                        Response =
                            a.Response
                    }
                ).ToList()
        };

        // ================ SAVE ================
        _context.Feedbacks.Add(
            feedback
        );

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Feedback submitted successfully",

            feedbackId =
                feedback.Id
        });
    }

    // ================ ADMIN: ALL FEEDBACKS ================
    [Authorize(Roles = "Admin")]
    [HttpGet("forms/{formId:guid}")]
    public async Task<IActionResult> GetFeedbackForForm(Guid formId)
    {
        var feedbacks =
            await _context.Feedbacks

            .Include(f => f.Answers)
            .ThenInclude(a => a.Question)

            .Include(f => f.Form)

            .Where(f =>
                f.FormId == formId
            )

            .Select(f => new
            {
                id = f.Id,

                name = f.Name,

                email = f.Email,

                designation =
                    f.Designation,

                formTitle =
                    f.Form.Title,

                createdAt =
                    f.CreatedAt,

                finalNote =
                    f.FinalNote,

                answers =
                    f.Answers.Select(a =>
                        new
                        {
                            question =
                                a.Question.Text,

                            answer =
                                a.Response
                        }
                    ).ToList()
            })

            .ToListAsync();

        return Ok(feedbacks);
    }

    // ================ SINGLE FEEDBACK ================
    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetFeedback(Guid id)
    {
        var feedback =
            await _context.Feedbacks

            .Include(f => f.Answers)
            .ThenInclude(a => a.Question)

            .Include(f => f.Form)

            .Where(f =>
                f.Id == id
            )

            .Select(f => new
            {
                id = f.Id,

                name = f.Name,

                email = f.Email,

                designation =
                    f.Designation,

                formTitle =
                    f.Form.Title,

                createdAt =
                    f.CreatedAt,

                finalNote =
                    f.FinalNote,

                answers =
                    f.Answers.Select(a =>
                        new
                        {
                            question =
                                a.Question.Text,

                            answer =
                                a.Response
                        }
                    ).ToList()
            })

            .FirstOrDefaultAsync();

        if (feedback == null)
        {
            return NotFound();
        }

        return Ok(feedback);
    }

    // ================ USER SUBMITTED FORMS ================
    [Authorize]
    [HttpGet("my-feedbacks")]
    public async Task<IActionResult> GetUserFeedbacks()
    {
        var email =
            User.FindFirst(
                ClaimTypes.Email
            )?.Value;

        var feedbacks =
            await _context.Feedbacks

            .Include(f => f.Form)

            .Include(f => f.Answers)
            .ThenInclude(a => a.Question)

            .Where(f =>
                f.Email == email
            )

            .Select(f => new
            {
                // FEEDBACK ID
                id = f.Id,

                // IMPORTANT
                // FORM ID ADD KORO
                formId = f.FormId,

                name = f.Name,

                email = f.Email,

                designation =
                    f.Designation,

                formTitle =
                    f.Form.Title,

                createdAt =
                    f.CreatedAt,

                finalNote =
                    f.FinalNote,

                answers =
                    f.Answers.Select(a =>
                        new
                        {
                            question =
                                a.Question.Text,

                            answer =
                                a.Response
                        }
                    ).ToList()
            })

            .ToListAsync();

        return Ok(feedbacks);
    }
    [Authorize]
    [HttpGet("available-forms")]
    public async Task<IActionResult> GetAvailableForms()
    {
        var email =
            User.FindFirst(
                ClaimTypes.Email
            )?.Value;

        if (string.IsNullOrEmpty(email))
        {
            return Unauthorized();
        }

        // Submitted form ids
        var submittedFormIds =
            await _context.Feedbacks

            .Where(f =>
                f.Email == email
            )

            .Select(f => f.FormId)

            .ToListAsync();

        // Forms user didn't submit
        var forms =
            await _context.FeedbackForms

            .Include(f => f.Questions)

            .Where(f =>
                !submittedFormIds.Contains(f.Id)
            )

            .Select(f => new
            {
                id = f.Id,

                title = f.Title,

                description =
                    f.Description,

                questions =
                    f.Questions.Select(q =>
                        new
                        {
                            id = q.Id,
                            text = q.Text,
                            type = q.Type
                        }
                    )
            })

            .ToListAsync();

        return Ok(forms);
    }

    // ================ DELETE FEEDBACK ================
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteFeedback(Guid id)
    {
        var feedback =
            await _context.Feedbacks
            .Include(f => f.Answers)
            .FirstOrDefaultAsync(f =>
                f.Id == id
            );

        if (feedback == null)
        {
            return NotFound();
        }

        // DELETE ANSWERS
        _context.Answers.RemoveRange(
            feedback.Answers
        );

        // DELETE FEEDBACK
        _context.Feedbacks.Remove(
            feedback
        );

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Feedback deleted successfully"
        });
    }

    // ================ ADMIN: ALL FEEDBACKS ================
    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllFeedbacks()
    {
        var feedbacks = await _context.Feedbacks
            .Include(f => f.Form)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new
            {
                id = f.Id,
                formId = f.FormId,
                name = f.Name,
                email = f.Email,
                designation = f.Designation,
                formTitle = f.Form.Title,
                createdAt = f.CreatedAt
            })
            .ToListAsync();

        return Ok(feedbacks);
    }
}