using Authservice.Data;
using Authservice.Models;
using Microsoft.EntityFrameworkCore;
namespace Authservice.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(Guid id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }
        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

       public async Task UpdateUserAsync(User user)
{
    var existingUser = await _context.Users
        .FirstOrDefaultAsync(u => u.Id == user.Id);

    if (existingUser == null)
        return;

    // Only update fields you actually want to change
    existingUser.Name = user.Name;
    existingUser.Email = user.Email;
    existingUser.RefreshToken = user.RefreshToken;
    existingUser.Role = user.Role;
    existingUser.Password = user.Password;

    await _context.SaveChangesAsync();
}
        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<User> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }
        public async Task<int> GetUsersCountAsync()
{
    return await _context.Users.CountAsync();
}
    }
}