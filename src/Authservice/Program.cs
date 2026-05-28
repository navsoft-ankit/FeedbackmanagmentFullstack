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


// 🔥 JWT SERVICE (IMPORTANT)
builder.Services.AddScoped<IJwtService, JwtService>();

// Business Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IFormService, FormService>();
builder.Services.AddScoped<IExportService, ExportService>();

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
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }
)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = configuration["Jwt:Issuer"],
        ValidAudience = configuration["Jwt:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
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
app.UseAuthentication();   //IMPORTANT (JWT check)
app.UseAuthorization();

app.MapControllers();

app.Run();