using BloggerApi.Posts.Entities;
using Microsoft.EntityFrameworkCore;

namespace BloggerApi.Posts.Infrastructure;

public class BlogsDbContext : DbContext
{
    // private string userId;
    public BlogsDbContext(DbContextOptions<BlogsDbContext> options
    // IHttpContextAccessor httpContextAccessor
    )
    : base(options)
    {
        // this.userId = httpContextAccessor.HttpContext!.User.Identity!.Name!;
    }

    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // modelBuilder.Entity<Post>().HasQueryFilter(p => p.UserName.Equals(userId));
    }
}
