using Authservice.Models;
using Authservice.Repository;

namespace Authservice.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
        }

        public async Task<List<User>> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            return user != null ? new List<User> { user } : new List<User>();
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }

        public async Task AddUserAsync(User user)
        {
            await _userRepository.AddUserAsync(user);
        }

        public async Task UpdateUserAsync(User user)
        {
            await _userRepository.UpdateUserAsync(user);
        }

        public async Task DeleteUserAsync(Guid id)
        {
            await _userRepository.DeleteUserAsync(id);
        }
        public async Task<User> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _userRepository.GetUserByRefreshTokenAsync(refreshToken);
        }
    }
}