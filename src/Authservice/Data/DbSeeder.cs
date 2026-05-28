using Authservice.Data;
public class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!context.Users.Any())
        {
            context.Users.AddRange(new User
            {
                Name = "Admin1",
                Email = "Admin1@example.com",
                Password = "Admin1123",
                Role = "Admin"
            },
            new User
            {
                Name = "Admin2",
                Email = "Admin2@example.com",
                Password = "Admin2123",
                Role = "Admin"
            }
            ); 
            await context.SaveChangesAsync();
        }
    }
}