using Authservice.Models;
using Authservice.DTOs.Form;
using Authservice.Repository;
using Microsoft.EntityFrameworkCore;

namespace Authservice.Service
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;

        public FeedbackService(IFeedbackRepository feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }

        public async Task<List<Feedback>> GetAllFeedbacksAsync()
        {
            return await _feedbackRepository.GetAllFeedbacksAsync();
        }

        public async Task<Feedback> GetFeedbackByIdAsync(Guid id)
        {
            return await _feedbackRepository.GetFeedbackByIdAsync(id);
        }

        public async Task<List<Feedback>> GetFeedbacksByUserIdAsync(Guid userId)
        {
            return await _feedbackRepository.GetFeedbacksByUserIdAsync(userId);
        }

        // public async Task AddFeedbackAsync(Feedback feedback)
        // {
        //     await _feedbackRepository.AddFeedbackAsync(feedback);
        // }

        public async Task UpdateFeedbackAsync(Feedback feedback)
        {
            await _feedbackRepository.UpdateFeedbackAsync(feedback);
        }

        public async Task DeleteFeedbackAsync(Guid id)
        {
            await _feedbackRepository.DeleteFeedbackAsync(id);
        }

        public async Task<bool> SubmitFeedbackAsync(SubmitFeedbackDTO dto)
        {
            var feedback = new Feedback
            {
                FormId = dto.FormId,
                Name = dto.Name,
                Email = dto.Email,
                Designation = dto.Designation,
                FinalNote = dto.FinalNote,

                CreatedAt = DateTime.UtcNow, // ✅ FIX ADDED

                Answers = new List<Answer>()
            };

            foreach (var a in dto.Answers)
            {
                feedback.Answers.Add(new Answer
                {
                    QuestionId = a.QuestionId,
                    Response = a.Response,
                    Feedback = feedback,
                    CreatedAt = DateTime.UtcNow // (optional but good)
                });
            }

            await _feedbackRepository.AddFeedbackAsync(feedback);

            return true;
        }
        public async Task<object> GetFeedbackActivityAsync()
        {
            // STEP 1: get all feedbacks
            var feedbacks = await _feedbackRepository.GetAllFeedbacksAsync();

            // STEP 2: build last 7 days range
            var last7Days = Enumerable.Range(0, 7)
                .Select(i => DateTime.UtcNow.Date.AddDays(-i))
                .OrderBy(d => d)
                .ToList();

            // STEP 3: calculate activity per day
            var result = last7Days
                .Select(date => new
                {
                    day = date.ToString("ddd"),
                    count = feedbacks.Count(f =>
                        EF.Functions.DateDiffDay(f.CreatedAt, date) == 0
                    )
                })
                .ToList();

            // STEP 4: return API response
            return result;
        }
    }
}