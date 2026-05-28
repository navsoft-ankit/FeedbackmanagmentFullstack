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

        public ExportService(
            IFeedbackRepository feedbackRepository
        )
        {
            _feedbackRepository =
                feedbackRepository;
        }

        public async Task<
            (
                byte[] fileContent,
                string contentType,
                string fileName
            )
        >
        ExportFeedbackAsync(
            ExportDTO request
        )
        {
            var data =
                await _feedbackRepository
                .GetAnswersByDateAsync(
                    request.FromDate,
                    request.ToDate
                );

            Console.WriteLine(
                "Data count: " +
                data.Count
            );

            return request.Format switch
            {
                ExportFormat.CSV =>
                    GenerateCsv(data),

                ExportFormat.Excel =>
                    throw new NotImplementedException(),

                ExportFormat.Pdf =>
                    throw new NotImplementedException(),

                _ => GenerateCsv(data)
            };
        }

        // =========================
        // CSV EXPORT
        // =========================

        private (
            byte[],
            string,
            string
        )
        GenerateCsv(
            List<Answer> data
        )
        {
            using var memoryStream =
                new MemoryStream();

            using var writer =
                new StreamWriter(
                    memoryStream
                );

            // =========================
            // CSV CONFIG
            // =========================

            var config =
                new CsvConfiguration(
                    CultureInfo.InvariantCulture
                )
                {
                    Delimiter = ","
                };

            using var csv =
                new CsvWriter(
                    writer,
                    config
                );

            // =========================
            // CSV HEADER
            // =========================

            csv.WriteField(
                "User Name"
            );

            csv.WriteField(
                "Email"
            );

            csv.WriteField(
                "Designation"
            );

            csv.WriteField(
                "Question"
            );

            csv.WriteField(
                "Answer"
            );

            csv.WriteField(
                "Final Note"
            );

            csv.WriteField(
                "Date"
            );

            csv.NextRecord();

            // =========================
            // CSV DATA
            // =========================

            foreach (var item in data)
            {
                Console.WriteLine(
                    "QUESTION: " +
                    item.Question?.Text
                );

                Console.WriteLine(
                    "ANSWER: " +
                    item.Response
                );

                Console.WriteLine(
                    "USER: " +
                    item.Feedback?.Name
                );

                csv.WriteField(
                    item.Feedback?.Name
                );

                csv.WriteField(
                    item.Feedback?.Email
                );

                csv.WriteField(
                    item.Feedback?.Designation
                );

                csv.WriteField(
                    item.Question?.Text
                );

                csv.WriteField(
                    item.Response
                );

                csv.WriteField(
                    item.Feedback?.FinalNote
                );

                csv.WriteField(
                    item.CreatedAt
                    .ToString(
                        "yyyy-MM-dd"
                    )
                );

                csv.NextRecord();
            }

            writer.Flush();

            memoryStream.Position = 0;

            return
            (
                memoryStream.ToArray(),

                "text/csv",

                "feedback.csv"
            );
        }
    }
}