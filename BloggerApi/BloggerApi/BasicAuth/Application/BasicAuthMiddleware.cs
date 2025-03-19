using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Principal;
using BloggerApi.BasicAuth.UseCases;
using BloggerApi.BasicAuth.UseCases.Util;

namespace BloggerApi.BasicAuth.Application;

public class BasicAuthMiddleware
{
    private RequestDelegate next;

    public BasicAuthMiddleware(RequestDelegate next)
    {
        this.next = next;
    }

    public async Task InvokeAsync(HttpContext context, UserService userService)
    {
        try
        {
            var basicToken = AuthenticationHeaderValue.Parse(context.Request.Headers.Authorization!).Parameter!;
            var creds = BasicAuthUtil.GetCreds(basicToken)!;
            var user = userService.FindByCreds(creds)!;

            var identity = new GenericIdentity(user.Username);
            context.User = new ClaimsPrincipal(identity);
        }
        catch
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        await next(context);
    }


}
