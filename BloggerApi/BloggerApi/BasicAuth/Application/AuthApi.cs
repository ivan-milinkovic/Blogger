using Microsoft.AspNetCore.Mvc;

namespace BloggerApi.BasicAuth.Application;

[ApiController]
[Route("api/auth")]
public class AuthApiController : ControllerBase
{
    [HttpGet]
    public ActionResult CheckCredentials()
    {
        // middleware handles authorization, won't get here if not authorized
        return Ok();
    }
}
