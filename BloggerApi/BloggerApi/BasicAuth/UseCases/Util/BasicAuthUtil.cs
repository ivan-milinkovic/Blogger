using System.Text;
using BloggerApi.BasicAuth.Entities;

namespace BloggerApi.BasicAuth.UseCases.Util;

public static class BasicAuthUtil
{
    public static Credentials? GetCreds(string base64BasicToken)
    {
        var credsBytes = Convert.FromBase64String(base64BasicToken);
        var creds = Encoding.UTF8.GetString(credsBytes).Split(":");
        var user = creds[0];
        var pass = creds[1];
        if (user is null || pass is null)
        {
            return null;
        }
        return new Credentials(user, pass);
    }
}