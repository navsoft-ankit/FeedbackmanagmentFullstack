using Authservice.Models;

namespace Authservice.Repository
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(Guid id);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByRefreshTokenAsync(string refreshToken);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);
    }
}