using Microsoft.AspNetCore.Mvc;
using Authservice.DTOs;
using Authservice.Models;
using Authservice.Service;
using Microsoft.AspNetCore.Authorization;
using System.Reflection.Metadata.Ecma335;


namespace Authservice.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;

        public AuthController(IUserService userService, IJwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        [Authorize(AuthenticationSchemes = "ApiKey")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            var existingUser = await _userService.GetUserByEmailAsync(registerDTO.Email);

            if (existingUser != null)
            {
                return BadRequest("Account already exists with this email.");
            }

            var user = new User
            {
                Name = registerDTO.Name,
                Email = registerDTO.Email,
                Password = registerDTO.Password,
                  Role = registerDTO.Role ?? "User"
            };

            await _userService.AddUserAsync(user);

            return Ok("User registered successfully.");
        }
        [HttpPost("login")]
        [Authorize(AuthenticationSchemes = "ApiKey")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            var user = await _userService.GetUserByEmailAsync(loginDTO.Email);

            if (user == null || user.Password != loginDTO.Password)
                return Unauthorized("Invalid email or password.");

            var token = _jwtService.GenerateToken(user);
            var refreshToken = Guid.NewGuid().ToString();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userService.UpdateUserAsync(user);
            return Ok(
                new
                {
                    Message = $"{user.Role} logged in successfully",
                    Role = user.Role,
                    Token = token,
                    RefreshToken = refreshToken
                }
            );
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
        {
            var user = await _userService.GetUserByEmailAsync(dto.Email);

            if (user == null)
                return BadRequest("User not found.");

            // 1. generate token
            var token = Guid.NewGuid().ToString();

            // 2. save token with expiry (DB or cache)
            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);

            await _userService.UpdateUserAsync(user);

            // 3. create reset link
            var resetLink = $"https://yourfrontend.com/reset-password?token={token}&email={user.Email}";

            // 4. send email (এখানে mock)
            return Ok(new { message = "Reset link generated", link = resetLink });
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            var user = await _userService.GetUserByEmailAsync(dto.Email);

            if (user == null)
                return BadRequest("User not found.");

            // check token
            if (user.ResetToken != dto.Token || user.ResetTokenExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired token.");

            // set new password
            user.Password = dto.NewPassword;

            // clear token
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _userService.UpdateUserAsync(user);

            return Ok("Password reset successful.");
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] LoginResponseDTO dto)
        {
            var user = await _userService.GetUserByRefreshTokenAsync(dto.RefreshToken);

            if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token.");

            var newToken = _jwtService.GenerateToken(user);
            var newRefreshToken = Guid.NewGuid().ToString();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userService.UpdateUserAsync(user);

            return Ok(new
            {
                Token = newToken,
                RefreshToken = newRefreshToken
            });
        }
    }
}