using Microsoft.AspNetCore.Identity;

namespace BloggerApi.Identity.Entities;

public class AppIdentityUser : IdentityUser
{
    public AppIdentityUser() : base() { }
    public AppIdentityUser(string userName) : base(userName) { }
}