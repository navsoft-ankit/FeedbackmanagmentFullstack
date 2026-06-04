using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Authservice.Data;
using Authservice.DTOs;

namespace Authservice.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(
        AppDbContext context
    )
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        // COUNT FEEDBACK FORMS
        var totalForms = await _context
            .FeedbackForms
            .CountAsync();

        // COUNT FEEDBACKS
        var totalFeedbacks = await _context
            .Feedbacks
            .CountAsync();

        double rating = 0;

        if (totalFeedbacks > 0)
        {
            rating = 4.5;
        }

        var result = new DashboardStatsDTO
        {
            TotalForms = totalForms,

            TotalFeedbacks = totalFeedbacks,

            Rating = rating
        };

        return Ok(result);
    }
   [HttpGet("feedback-activity")]
public async Task<IActionResult> GetFeedbackActivity()
{
    var startDate = DateTime.UtcNow.Date.AddDays(-6);

    var feedbacks = await _context.Feedbacks
        .Where(f => f.CreatedAt >= startDate)
        .ToListAsync();

    var result = Enumerable.Range(0, 7)
        .Select(i =>
        {
            var date = startDate.AddDays(i);

            return new
            {
                day = date.ToString("ddd"),
                count = feedbacks.Count(f =>
                    f.CreatedAt.Date == date
                )
            };
        });

    return Ok(result);
}

}