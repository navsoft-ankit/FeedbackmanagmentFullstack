using Microsoft.EntityFrameworkCore;
using Authservice.Data;
using Authservice.Repository;
using Authservice.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using Authservice.Authentication;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;


// JWT SERVICE (IMPORTANT)
builder.Services.AddScoped<IJwtService, JwtService>();

// Business Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IFormService, FormService>();
builder.Services.AddScoped<IExportService, ExportService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();

// DB Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
);

// -------------------- JWT AUTHENTICATION --------------------
builder.Services.AddAuthentication(
    options =>
    {
        //প্রতিবার request আসলে কোন method দিয়ে user identity check হবে?(JWT)
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

        //যদি user unauthorized হয় (401), তাহলে কোন system response দেবে?(JWT)
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }
)
.AddJwtBearer(options =>
{
    // JWT token validation rules set করা হচ্ছে
    options.TokenValidationParameters = new TokenValidationParameters
    {
        
        // Token issuer (কে token বানিয়েছে) verify করবে
        ValidateIssuer = true,

        // Token audience (কার জন্য token) verify করবে
        ValidateAudience = true,

        // Token expired কিনা check করবে
        ValidateLifetime = true,

        // Token signature valid কিনা verify করবে (tamper detect)
        ValidateIssuerSigningKey = true,

        // Expected issuer value (appsettings.json থেকে নেওয়া)
        ValidIssuer = configuration["Jwt:Issuer"],

        // Expected audience value (appsettings.json থেকে নেওয়া)
        ValidAudience = configuration["Jwt:Audience"],

        // Secret key ব্যবহার করে token signature verify করা হবে
        IssuerSigningKey = new SymmetricSecurityKey(

            // string key কে byte array এ convert করা হচ্ছে
            Encoding.UTF8.GetBytes(configuration["Jwt:Key"])

        )
    };
})
.AddScheme<AuthenticationSchemeOptions, ApiKeyAuthHandler>(
    "ApiKey", options => { });

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -------------------- BUILD APP --------------------
var app = builder.Build();

// -------------------- SEED DATA (CORRECT WAY) --------------------
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.SeedAsync(context);
}

// -------------------- MIDDLEWARE --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseRouting();
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();