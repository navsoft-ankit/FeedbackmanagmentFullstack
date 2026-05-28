using Authservice.Models;

namespace Authservice.Service
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsersAsync();
        Task<List<User>> GetUserByIdAsync(Guid id);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByRefreshTokenAsync(string refreshToken);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);
    }
}