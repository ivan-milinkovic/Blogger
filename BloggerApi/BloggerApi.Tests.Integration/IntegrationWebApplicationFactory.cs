using System.Net.Http.Json;
using BloggerApi.Identity.Entities;
using BloggerApi.Identity.Infrastructure;
using BloggerApi.Posts.Entities;
using BloggerApi.Posts.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

record LoginDto(string email, string password);
public record Tokens(string tokenType, string accessToken, string refreshToken, int expiresIn);

// https://github.com/andrewlock/asp-dot-net-core-in-action-3e/blob/main/Chapter36/B_RecipeApplication_SQLite/test/RecipeApplication.Tests/CustomWebApplicationFactory.cs

public sealed class IntegrationWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private SqliteConnection? identityDbConnection;
    private SqliteConnection? blogsDbConnection;
    private Tokens? tokens;

    public readonly string UserName = "test@test";
    private readonly string IdentityDbSource = "DataSource=:memory:";
    private readonly string BlogsDbSource = "DataSource=:memory:";
    // private readonly string IdentityDbSource = "DataSource=blogs-identity-test.sqlite";
    // private readonly string BlogsDbSource = "DataSource=blogs-test.sqlite";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        identityDbConnection = new SqliteConnection(IdentityDbSource);
        identityDbConnection.Open();
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<AppIdentityDbContext>>();
            services.AddDbContext<AppIdentityDbContext>(opt => opt.UseSqlite(identityDbConnection));
        });

        blogsDbConnection = new SqliteConnection(BlogsDbSource);
        blogsDbConnection.Open();
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<BlogsDbContext>>();
            services.AddDbContext<BlogsDbContext>(opt => opt.UseSqlite(blogsDbConnection));
        });

        builder.UseEnvironment("Development");
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);
        SetupDatabase(host.Services);
        return host;
    }

    private void SetupDatabase(IServiceProvider services)
    {
        // Console.WriteLine("### SetupDatabase");
        using (var scope = services.CreateScope())
        {
            var identityDbContext = scope.ServiceProvider.GetRequiredService<AppIdentityDbContext>();
            var blogsDbContext = scope.ServiceProvider.GetRequiredService<BlogsDbContext>();

            // Causes sqlite disk I/O error
            // identityDbContext.Database.EnsureDeleted();
            // blogsDbContext.Database.EnsureDeleted();

            identityDbContext.Database.EnsureCreated();
            blogsDbContext.Database.EnsureCreated();

            // identityDbContext.Database.Migrate();
            seedIdentity(identityDbContext, scope);

            // blogsDbContext.Database.Migrate();
            SeedBlogs(blogsDbContext);
        }

        // Login().Wait(); // causes infinite recursion
    }

    public void Cleanup()
    {
        // Console.WriteLine("### Cleanup");
        using (var scope = this.Services.CreateScope())
        {
            var identityDbContext = scope.ServiceProvider.GetRequiredService<AppIdentityDbContext>();
            var blogsDbContext = scope.ServiceProvider.GetRequiredService<BlogsDbContext>();
            identityDbContext.Database.EnsureDeleted();
            blogsDbContext.Database.EnsureDeleted();
        }
    }

    private void seedIdentity(AppIdentityDbContext dbContext, IServiceScope scope)
    {
        if (dbContext.Users.Any()) { return; }
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppIdentityUser>>();
        var user = new AppIdentityUser(UserName);
        userManager.CreateAsync(user, "123").Wait();
    }

    public async Task Login()
    {
        var loginDto = new LoginDto("test@test", "123");

        var httpClient = CreateClient();
        var response = await httpClient.PostAsJsonAsync("login?useCookies=false&useSessionCookies=false", loginDto);
        response.EnsureSuccessStatusCode();
        var tokens = (await response.Content.ReadFromJsonAsync<Tokens>())!;
        this.tokens = tokens;
    }

    private void SeedBlogs(BlogsDbContext dbContext)
    {
        if (dbContext.Posts.Any()) { return; }
        var p1 = new Post() { Id = 1, Title = "Test Post 1", Content = "Test Content 1", UserName = UserName };
        var p2 = new Post() { Id = 2, Title = "Test Post 2", Content = "Test Content 2", UserName = UserName };
        var p3 = new Post() { Id = 3, Title = "Test Post 3", Content = "Test Content 3", UserName = UserName };
        dbContext.Posts.AddRange([p1, p2, p3]);
        dbContext.SaveChanges();
    }

    public Tokens Tokens
    {
        get
        {
            return tokens!;
        }
    }

    public void AuthorizeRequest(HttpRequestMessage request)
    {
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(Tokens.tokenType, Tokens.accessToken);
    }

    public Task InitializeAsync()
    {
        // Console.WriteLine("### InitializeAsync");
        return Task.CompletedTask;
    }

    Task IAsyncLifetime.DisposeAsync()
    {
        // Console.WriteLine("### DisposeAsync");
        Cleanup();
        return Task.CompletedTask;
    }
}


// https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-9.0

// public sealed class IntegrationWebApplicationFactory : WebApplicationFactory<Program>
// {
//     protected override void ConfigureWebHost(IWebHostBuilder builder)
//     {
//         builder.ConfigureServices(services =>
//         {
//             var dbContextDesc = services.SingleOrDefault(d =>
//                 d.ServiceType == typeof(IDbContextOptionsConfiguration<AppIdentityDbContext>)
//             );
//             if (dbContextDesc != null) services.Remove(dbContextDesc);

//             var dbConnection = services.SingleOrDefault(d => d.ServiceType == typeof(DbConnection));
//             if (dbConnection != null) services.Remove(dbConnection);

//             services.AddSingleton<DbConnection>(container =>
//             {
//                 var connection = new SqliteConnection("DataSource=:memory:");
//                 // var connection = new SqliteConnection("DataSource=blogs-identity.sqlite");
//                 connection.Open();
//                 return connection;
//             });

//             services.AddDbContext<AppIdentityDbContext>((container, options) =>
//             {
//                 var connection = container.GetRequiredService<DbConnection>();
//                 options.UseSqlite(connection);
//             });
//         });

//         builder.UseEnvironment("Development");
//     }
// }
