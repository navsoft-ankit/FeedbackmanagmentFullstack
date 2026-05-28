using Authservice.DTOs.Export;
using Authservice.Models;
namespace Authservice.Service
{
    public interface IExportService
    {
        Task<(byte[] fileContent,
              string contentType,
              string fileName)>
        ExportFeedbackAsync(ExportDTO request);
    }
}