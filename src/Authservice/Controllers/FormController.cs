using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Authservice.DTOs;
using Authservice.Service;


namespace Authservice.Controllers;

[Authorize(Roles = "Admin")] // পুরো controller secure
[ApiController]
[Route("api/forms")]
[Authorize] // পুরো controller secure
public class FormController : ControllerBase
{
    private readonly IFormService _service;

    public FormController(IFormService service)
    {
        _service = service;
    }

    // 🔥 Admin only
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateFormDTO dto)
    {
        var result = await _service.CreateFormAsync(dto);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFormDTO dto)
    {
        var result = await _service.UpdateFormAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteFormAsync(id);
        return Ok(result);
    }

    // 🔓 Public (form view করতে পারে সবাই)
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        return Ok(await _service.GetFormAsync(id));
    }
    //PUBLIC ALL FORMS
[AllowAnonymous]
[HttpGet("all-public")]
public async Task<IActionResult> GetAll()
{
    var forms = await _service.GetAllFormsAsync();

    return Ok(forms);
}
}