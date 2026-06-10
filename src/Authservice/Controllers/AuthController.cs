using Microsoft.AspNetCore.Mvc;
using Authservice.DTOs;
using Authservice.Models;
using Authservice.Service;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using System.Text;
using Authservice.Data;
using Microsoft.EntityFrameworkCore;
namespace Authservice.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _context;

        public AuthController(
            IUserService userService,
            IJwtService jwtService,
            IEmailService emailService,
            AppDbContext context)
        {
            _userService = userService;
            _jwtService = jwtService;
            _emailService = emailService;
            _context = context;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        [Authorize(AuthenticationSchemes = "ApiKey")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            var existingUser = await _userService.GetUserByEmailAsync(dto.Email);

            if (existingUser != null)
                return Conflict(new { message = "Email already exists" });

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role ?? "User",
                CreatedAt = DateTime.UtcNow
            };

            await _userService.AddUserAsync(user);

            return Ok("User registered successfully.");
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        [Authorize(AuthenticationSchemes = "ApiKey")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            var user = await _userService.GetUserByEmailAsync(dto.Email);

            if (user == null || string.IsNullOrEmpty(user.Password))
                return Unauthorized("Invalid email or password");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Invalid email or password");

            var token = _jwtService.GenerateToken(user);

            var refreshToken = Convert.ToBase64String(
                RandomNumberGenerator.GetBytes(64)
            );

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userService.UpdateUserAsync(user);

            return Ok(new
            {
                message = $"{user.Role} logged in successfully",
                name = user.Name,
                email = user.Email,
                role = user.Role,
                token,
                refreshToken,
                createdAt = user.CreatedAt
            });
        }

        // ================= FORGOT PASSWORD =================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
        {
            var user = await _userService.GetUserByEmailAsync(dto.Email);

            if (user == null)
                return Ok("If email exists, reset link sent.");

            // SAFE TOKEN (HEX ONLY — NO URL ISSUES)
            var tokenBytes = RandomNumberGenerator.GetBytes(32);
            var token = Convert.ToHexString(tokenBytes);

            // store HASH in DB
            var tokenHash = Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(token))
            );

            user.ResetToken = tokenHash;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);

            await _userService.UpdateUserAsync(user);

            // SAFE URL
            var resetLink =
                $"http://localhost:5173/reset-password?email={Uri.EscapeDataString(user.Email)}&token={token}";

            await _emailService.SendEmailAsync(
                user.Email,
                "Reset Password",
                $"Click here: {resetLink}"
            );

            return Ok("If email exists, reset link sent.");
        }

        // ================= RESET PASSWORD =================
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid request");

            var user = await _userService.GetUserByEmailAsync(dto.Email);

            if (user == null)
                return BadRequest("Invalid reset link");

            if (string.IsNullOrEmpty(user.ResetToken))
                return BadRequest("Invalid reset link");

            if (user.ResetTokenExpiry < DateTime.UtcNow)
                return BadRequest("Reset link expired");

            // hash incoming token
            var incomingHash = Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(dto.Token))
            );

            if (incomingHash != user.ResetToken)
                return BadRequest("Invalid reset link");

            // update password
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            // clear token
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _userService.UpdateUserAsync(user);

            return Ok("Password reset successful");
        }

        // ================= REFRESH TOKEN =================
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] LoginResponseDTO dto)
        {
            var user = await _userService.GetUserByRefreshTokenAsync(dto.RefreshToken);

            if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token");

            var newToken = _jwtService.GenerateToken(user);

            var newRefreshToken = Convert.ToBase64String(
                RandomNumberGenerator.GetBytes(64)
            );

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userService.UpdateUserAsync(user);

            return Ok(new
            {
                token = newToken,
                refreshToken = newRefreshToken
            });
        }

        // ================= TOTAL ACTIVE USER =================
        [HttpGet("active-users-count")]
        public async Task<IActionResult> GetActiveUsersCount()
        {
            var count = await _userService.GetUsersCountAsync();
            return Ok(new { activeUsers = count });
        }

        // ================= TOTAL USERS =================
        [HttpGet("total-users")]
        public async Task<IActionResult> GetTotalUsers()
        {
            var count = await _context.Users.CountAsync();
            return Ok(new { totalUsers = count });
        }
    }
}