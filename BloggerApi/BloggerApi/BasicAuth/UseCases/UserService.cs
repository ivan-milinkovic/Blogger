using BloggerApi.BasicAuth.Entities;
using BloggerApi.BasicAuth.UseCases.Util;

namespace BloggerApi.BasicAuth.UseCases;

public class UserService
{
    private User MyUser = new() { Username = "ivan", Password = PasswordHasher.Hash("123") };

    public User? FindByCreds(Credentials creds)
    {
        if (creds.Username != MyUser.Username || PasswordHasher.Hash(creds.Password) != MyUser.Password)
        {
            return null;
        }
        return MyUser;
    }
}
