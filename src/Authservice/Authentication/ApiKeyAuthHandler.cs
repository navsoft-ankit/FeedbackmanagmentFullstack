using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
namespace Authservice.Authentication;

public class ApiKeyAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private const string ApiKeyHeaderName = "X-Api-Key";
    private readonly IConfiguration _config;

    public ApiKeyAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IConfiguration config)
        : base(options, logger, encoder, clock)
    {
        _config = config;
    }

    // Main authentication method
    // Request আসলে ASP.NET Core automatically এই method call করবে
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Request header এ X-Api-Key আছে কিনা check করছে
        // extractedApiKey variable এ value store হবে

        if (!Request.Headers.TryGetValue(ApiKeyHeaderName, out var extractedApiKey))
        {
            // Header না থাকলে authentication fail

            return Task.FromResult(
                AuthenticateResult.Fail("API Key missing"));
        }


        // appsettings.json থেকে actual/valid API key read করছে

        var validApiKey = _config["Apisettings:ApiKey"];


        // Request থেকে পাওয়া key এবং
        // appsettings.json এর key compare করছে

        if (!validApiKey.Equals(extractedApiKey))
        {
            // Key match না করলে authentication fail

            return Task.FromResult(
                AuthenticateResult.Fail("Invalid API Key"));
        }


        // User claim তৈরি করছে
        // এখানে authenticated user এর name = ApiUser

        var claims = new[]
        {
        new Claim(ClaimTypes.Name, "ApiUser")
    };


        // Claims দিয়ে user identity তৈরি করছে

        var identity = new ClaimsIdentity(claims, Scheme.Name);


        // Identity দিয়ে authenticated user object তৈরি করছে

        var principal = new ClaimsPrincipal(identity);


        // Authentication ticket তৈরি করছে
        // এটা ASP.NET Core কে বলে:
        // "এই user successfully authenticated"

        var ticket = new AuthenticationTicket(principal, Scheme.Name);


        // Final success response return করছে

        return Task.FromResult(
            AuthenticateResult.Success(ticket));
    }
}