
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BloggerApi.Posts.Application.DTO;
using BloggerApi.Posts.Entities;
using BloggerApi.Posts.Infrastructure;

namespace BloggerApi.Posts.Application;

[Authorize]
[ApiController]
[Route("api/posts")]
public class PostsApiController : ControllerBase
{
    private ILogger<PostsApiController> log;
    private BlogsDbContext db;
    private string userName;

    public PostsApiController(BlogsDbContext db, ILogger<PostsApiController> log, IHttpContextAccessor httpContextAccessor)
    {
        this.db = db;
        this.log = log;
        this.userName = httpContextAccessor.HttpContext!.User.Identity!.Name!;
    }

    [HttpGet]
    public IList<Post> GetAll()
    {
        return db.Posts.ToList();
    }

    [HttpGet("list")]
    public IList<PostListItemDto> GetAllLessData()
    {
        return db.Posts
        .Where(p => p.UserName == userName)
        .Select(p =>
            new PostListItemDto { Id = p.Id, Title = p.Title }
        )
        .ToList();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetById(int id)
    {
        var post = await db.Posts.FirstOrDefaultAsync(p => p.Id == id);
        if (post is null)
        {
            return NotFound();
        }
        return Ok(post);
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreatePostDto dto)
    {
        var newPost = new Post { Title = dto.Title, Content = dto.Content, UserName = userName };
        await db.Posts.AddAsync(newPost);
        await db.SaveChangesAsync();
        return Ok(newPost);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdatePostDto inputPost)
    {
        var post = await db.Posts.FirstOrDefaultAsync(p => p.Id == id);
        if (post is null)
        {
            return NotFound();
        }
        post.Title = inputPost.Title;
        post.Content = inputPost.Content;
        await db.SaveChangesAsync();
        return Ok(post);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var post = await db.Posts.FirstOrDefaultAsync(p => p.Id == id);
        if (post is null)
        {
            return NotFound();
        }
        db.Posts.Remove(post);
        await db.SaveChangesAsync();
        return Ok();
    }
}
