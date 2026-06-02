using Authservice.DTOs.Export;
using Authservice.Service;
using Microsoft.AspNetCore.Mvc;

namespace Authservice.Controllers
{
    [ApiController]
    [Route("api/export")]
    public class ExportController : ControllerBase
    {
        private readonly IExportService _exportService;

        public ExportController(IExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpPost("feedback")]
        public async Task<IActionResult> Export([FromBody] ExportDTO request)
        {
            if (request == null)
                return BadRequest("Request body is empty");

            var result = await _exportService.ExportFeedbackAsync(request);

            return File(
                result.fileContent,
                result.contentType,
                result.fileName
            );
        }
    }
}