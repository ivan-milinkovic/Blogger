using BloggerApi.Identity.Entities;
using BloggerApi.Identity.Infrastructure;
using BloggerApi.Posts.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpContextAccessor();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<AppIdentityDbContext>(options =>
    options.UseSqlite("Data Source=Database/blogs-identity.sqlite")
);

builder.Services.AddDbContext<BlogsDbContext>(opts =>
    opts.UseSqlite("Data Source=Database/blogs.sqlite")
);

// builder.Services.AddAuthentication()
//     .AddScheme<BasicAuthOptions, BasicAuthHandler>("MyBasicAuth", opt => { });

builder.Services.AddAuthorization();
builder.Services
    .AddIdentityApiEndpoints<AppIdentityUser>(opt =>
    {
        opt.SignIn.RequireConfirmedEmail = false;
        opt.Password.RequireNonAlphanumeric = false;
        opt.Password.RequireLowercase = false;
        opt.Password.RequireUppercase = false;
        opt.Password.RequiredLength = 3;
    })
    .AddEntityFrameworkStores<AppIdentityDbContext>();

// builder.Services.AddSingleton<UserService>();
builder.Services.AddControllers();

var corsPolicyName = "CorsPolicyAllowLocalhost";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(name: corsPolicyName, policy =>
    {
        // policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

if (builder.Environment.IsDevelopment())
{

}
builder.Services.AddHttpLogging(opt =>
{
    opt.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All;
});

var app = builder.Build();

app.MapIdentityApi<AppIdentityUser>();

app.UseRouting();
app.UseCors(corsPolicyName);

app.MapGet("/", () => "root");

// app.UseMiddleware<BasicAuthMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(opt =>
        opt.SwaggerEndpoint("../openapi/v1.json", "Swagger UI")
    );
}
app.UseHttpLogging();

app.Run();

public partial class Program { } // Needed by integration tests