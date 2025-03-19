namespace BloggerApi.Posts.Entities;

public class Post
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required string UserName { get; set; }
}