using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authservice.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        // 🔐 API KEY TEST
        [Authorize(AuthenticationSchemes = "ApiKey")]
        [HttpGet("apikey")]
        public IActionResult ApiKeyTest()
        {
            return Ok("✅ API Key is working fine!");
        }

        // 🔐 JWT TEST
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("jwt")]
        public IActionResult JwtTest()
        {
            return Ok("✅ JWT is working fine!");
        }

        // 🔓 PUBLIC TEST (NO AUTH)
        [AllowAnonymous]
        [HttpGet("public")]
        public IActionResult PublicTest()
        {
            return Ok("🌍 Public endpoint is working!");
        }
    }
}