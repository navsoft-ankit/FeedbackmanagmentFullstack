using Authservice.Models;
namespace Authservice.Repository;
public interface IFeedbackRepository
{
    Task<List<Feedback>> GetAllFeedbacksAsync();
    Task<Feedback> GetFeedbackByIdAsync(Guid id);
    Task<List<Feedback>> GetFeedbacksByUserIdAsync(Guid userId);
    Task AddFeedbackAsync(Feedback feedback);
    Task UpdateFeedbackAsync(Feedback feedback);
    Task DeleteFeedbackAsync(Guid id);
    Task<List<Answer>> GetAnswersByDateAsync(DateTime fromDate, DateTime toDate);
}