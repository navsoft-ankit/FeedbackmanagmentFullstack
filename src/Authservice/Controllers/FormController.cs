using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Authservice.DTOs.Form;
using Authservice.Service;

namespace Authservice.Controllers;

[ApiController]
[Route("api/forms")]
[Authorize]
public class FormController : ControllerBase
{
    private readonly IFormService _service;

    public FormController(IFormService service)
    {
        _service = service;
    }

    // =========================
    // CREATE FORM
    // =========================
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateFormDTO dto)
    {
        try
        {
            var result = await _service.CreateFormAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // =========================
    // UPDATE FORM
    // =========================
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFormDTO dto)
    {
        try
        {
            var result = await _service.UpdateFormAsync(id, dto);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // =========================
    // DELETE FORM
    // =========================
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteFormAsync(id);

        if (!result)
            return NotFound();

        return Ok(result);
    }

    // =========================
    // GET SINGLE FORM
    // =========================
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var result = await _service.GetFormAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    // =========================
    // GET ALL FORMS (PUBLIC)
    // =========================
    [AllowAnonymous]
    [HttpGet("all-public")]
    public async Task<IActionResult> GetAll()
    {
        var forms = await _service.GetAllFormsAsync();
        return Ok(forms);
    }

    // =========================
    // 🔥 USER AVAILABLE FORMS
    // =========================
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailable([FromQuery] string email)
    {
        try
        {
            var result = await _service.GetAvailableFormsAsync(email);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // =========================
    // 🔥 USER FILLED FORMS
    // =========================
    [HttpGet("filled")]
    public async Task<IActionResult> GetFilled([FromQuery] string email)
    {
        try
        {
            var result = await _service.GetFilledFormsAsync(email);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // =========================
    // 🔥 USER DASHBOARD STATS
    // =========================
    [HttpGet("user-stats")]
    public async Task<IActionResult> GetUserStats([FromQuery] string email)
    {
        try
        {
            var result = await _service.GetUserStatsAsync(email);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}