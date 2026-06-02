using System.Globalization;
using Authservice.DTOs.Export;
using Authservice.Repository;
using Authservice.Models;
using CsvHelper;
using CsvHelper.Configuration;

namespace Authservice.Service
{
    public class ExportService : IExportService
    {
        private readonly IFeedbackRepository _feedbackRepository;

        public ExportService(IFeedbackRepository feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }

        public async Task<(byte[] fileContent, string contentType, string fileName)>
        ExportFeedbackAsync(ExportDTO request)
        {
            var data = await _feedbackRepository
                .GetAnswersByDateAndEmailAsync(
                    request.FromDate,
                    request.ToDate,
                    request.Email
                );

            return GenerateCsv(data);
        }

        // =========================
        // CSV GENERATOR
        // =========================
        private (byte[], string, string) GenerateCsv(List<Answer> data)
        {
            using var memoryStream = new MemoryStream();
            using var writer = new StreamWriter(memoryStream);

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ","
            };

            using var csv = new CsvWriter(writer, config);

            // HEADER
            csv.WriteField("User Name");
            csv.WriteField("Email");
            csv.WriteField("Designation");
            csv.WriteField("Question");
            csv.WriteField("Answer");
            csv.WriteField("Final Note");
            csv.WriteField("Date");
            csv.NextRecord();

            // DATA
            foreach (var item in data)
            {
                csv.WriteField(item.Feedback?.Name);
                csv.WriteField(item.Feedback?.Email);
                csv.WriteField(item.Feedback?.Designation);
                csv.WriteField(item.Question?.Text);
                csv.WriteField(item.Response);
                csv.WriteField(item.Feedback?.FinalNote);
                csv.WriteField(item.CreatedAt.ToString("yyyy-MM-dd"));
                csv.NextRecord();
            }

            writer.Flush();
            memoryStream.Position = 0;

            return (
                memoryStream.ToArray(),
                "text/csv",
                "feedback.csv"
            );
        }
    }
}