using Authservice.Models;
namespace Authservice.DTOs.Export
{
    public class ExportDTO
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public ExportFormat Format { get; set; }
    }
}