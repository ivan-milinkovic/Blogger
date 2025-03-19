using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Principal;
using System.Text.Encodings.Web;
using BloggerApi.BasicAuth.UseCases;
using BloggerApi.BasicAuth.UseCases.Util;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace BloggerApi.BasicAuth.Application;

public class BasicAuthHandler : AuthenticationHandler<BasicAuthOptions>
{
    private readonly UserService userService;
    private readonly ILogger<BasicAuthHandler> log;

    public BasicAuthHandler(
        IOptionsMonitor<BasicAuthOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        UserService userService
    ) : base(options, logger, encoder)
    {
        this.userService = userService;
        log = logger.CreateLogger<BasicAuthHandler>();
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously

    protected async override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        log.LogInformation("basic auth handler entry");
        try
        {
            var basicToken = AuthenticationHeaderValue.Parse(Request.Headers.Authorization!).Parameter!;
            var creds = BasicAuthUtil.GetCreds(basicToken)!;
            var user = userService.FindByCreds(creds)!;

            var identity = new GenericIdentity(user.Username);
            var principal = new ClaimsPrincipal(identity);

            var ticket = new AuthenticationTicket(principal, Scheme.Name);
            log.LogInformation("auth success");
            return AuthenticateResult.Success(ticket);
        }
        catch
        {
            log.LogInformation("auth fail");
            return AuthenticateResult.Fail("Unknown user");
        }
    }

#pragma warning restore CS1998

}

public class BasicAuthOptions : AuthenticationSchemeOptions
{

}

// https://stackoverflow.com/a/74001495
