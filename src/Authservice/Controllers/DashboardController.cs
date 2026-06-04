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
    var feedbacks = await _context.Feedbacks.ToListAsync();

    var last7Days = Enumerable.Range(0, 7)
        .Select(i => DateTime.UtcNow.Date.AddDays(-i))
        .OrderBy(d => d)
        .ToList();

    var result = last7Days.Select(date => new
    {
        day = date.ToString("ddd"),
        count = feedbacks.Count(f => f.CreatedAt.Date == date)
    });

    return Ok(result);
}
    
}