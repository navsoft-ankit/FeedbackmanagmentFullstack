public class User
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
   
    public string Role { get; set; }

    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpiry { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}
