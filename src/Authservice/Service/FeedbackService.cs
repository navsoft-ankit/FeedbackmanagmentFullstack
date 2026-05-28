using Authservice.Models;
using Authservice.DTOs.Form;
using Authservice.Repository;

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
                // Title = dto.Title,
                Answers = new List<Answer>()
            };

            foreach (var a in dto.Answers)
            {
                feedback.Answers.Add(new Answer
                {
                    QuestionId = a.QuestionId,
                    Response = a.Response,
                    Feedback = feedback   // 🔥 IMPORTANT FIX
                });
            }

            await _feedbackRepository.AddFeedbackAsync(feedback);

            return true;
        }
    }
}