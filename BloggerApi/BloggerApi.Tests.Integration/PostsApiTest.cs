using System.Net;
using System.Net.Http.Json;
using BloggerApi.Posts.Application.DTO;
using BloggerApi.Posts.Entities;
using Microsoft.AspNetCore.Http;

namespace BloggerApiIntegrationTests;

public class StarterTest : IClassFixture<IntegrationWebApplicationFactory>
{
    private IntegrationWebApplicationFactory factory;
    private HttpClient httpClient;

    public StarterTest(IntegrationWebApplicationFactory factory)
    {
        this.factory = factory;
        httpClient = factory.CreateClient();
        factory.Login().Wait();
    }

    [Fact]
    public async Task TestGetPostsList()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "api/posts/list");
        factory.AuthorizeRequest(request);

        var response = await httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();
        var posts = await response.Content.ReadFromJsonAsync<List<PostListItemDto>>();
        Assert.NotNull(posts);
        Assert.True(posts.Count > 0);
        var post1 = posts[0];
        Assert.Equal(1, post1.Id);
        Assert.Equal("Test Post 1", post1.Title);
    }

    [Fact]
    public async Task TestGetPostsFull()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "api/posts");
        factory.AuthorizeRequest(request);

        var response = await httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();
        var posts = await response.Content.ReadFromJsonAsync<List<Post>>();
        Assert.NotNull(posts);
        Assert.True(posts.Count > 0);
        Assert.True(posts.All(p => p.UserName == factory.UserName));
        var post1 = posts[0];
        Assert.Equal(1, post1.Id);
        Assert.Equal("Test Post 1", post1.Title);
        Assert.Equal("Test Content 1", post1.Content);
    }

    [Fact]
    public async Task TestGetPostById()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "api/posts/1");
        factory.AuthorizeRequest(request);

        var response = await httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();
        var post = await response.Content.ReadFromJsonAsync<Post>();
        Assert.NotNull(post);
        Assert.True(post.UserName == factory.UserName);
        Assert.Equal(1, post.Id);
        Assert.Equal("Test Post 1", post.Title);
        Assert.Equal("Test Content 1", post.Content);
    }

    [Fact]
    public async Task TestCreatePost()
    {
        var postData = new CreatePostDto("Test Created Title", "Test Created Content");
        var request = new HttpRequestMessage(HttpMethod.Post, "api/posts");
        request.Content = JsonContent.Create(postData);
        factory.AuthorizeRequest(request);

        var response = await httpClient.SendAsync(request);

        var returnedPost = await response.Content.ReadFromJsonAsync<Post>();
        Assert.NotNull(returnedPost);
        Assert.True(returnedPost.Id > 0);
        Assert.Equal(postData.Title, returnedPost.Title);
        Assert.Equal(postData.Content, returnedPost.Content);

        // Check the new post in the DB context directly
        // using (var scope = factory.Services.CreateScope())
        // {
        //     var dbContext = (BlogsDbContext)scope.ServiceProvider.GetService(typeof(BlogsDbContext));
        //     var fetchedPost = dbContext.Posts.First(p => p.Id == createdPost.Id);
        //     Assert.NotNull(fetchedPost);
        // }

        // Check that the newly created post can be fetched
        var fetchRequest = new HttpRequestMessage(HttpMethod.Get, $"api/posts/{returnedPost.Id}");
        factory.AuthorizeRequest(fetchRequest);
        var fetchResponse = await httpClient.SendAsync(fetchRequest);
        fetchResponse.EnsureSuccessStatusCode();
        var fetchedPost = await fetchResponse.Content.ReadFromJsonAsync<Post>();
        Assert.NotNull(fetchedPost);
        Assert.Equal(returnedPost.Id, fetchedPost.Id);
        Assert.Equal(returnedPost.Title, fetchedPost.Title);
        Assert.Equal(returnedPost.Content, fetchedPost.Content);
    }

    [Fact]
    public async Task TestUpdatePost()
    {
        // Create an initial post
        var postData = new CreatePostDto("Test Created Title", "Test Created Content");
        var request = new HttpRequestMessage(HttpMethod.Post, "api/posts");
        request.Content = JsonContent.Create(postData);
        factory.AuthorizeRequest(request);
        var creationResponse = await httpClient.SendAsync(request);
        Post initialPost = (await creationResponse.Content.ReadFromJsonAsync<Post>())!;

        // Update post
        var updatePostDto = new UpdatePostDto("Test Update Title", "Test Update Content");
        var updateRequest = new HttpRequestMessage(HttpMethod.Put, $"api/posts/{initialPost.Id}");
        updateRequest.Content = JsonContent.Create(updatePostDto);
        factory.AuthorizeRequest(updateRequest);

        var updateResponse = await httpClient.SendAsync(updateRequest);

        // Check returned post
        updateResponse.EnsureSuccessStatusCode();
        var returnedPost = await updateResponse.Content.ReadFromJsonAsync<Post>();
        Assert.NotNull(returnedPost);
        Assert.Equal(initialPost.Id, returnedPost.Id);
        Assert.Equal(updatePostDto.Title, returnedPost.Title);
        Assert.Equal(updatePostDto.Content, returnedPost.Content);

        // Fetch post and check data
        var fetchRequest = new HttpRequestMessage(HttpMethod.Get, $"api/posts/{initialPost.Id}");
        factory.AuthorizeRequest(fetchRequest);
        var fetchResponse = await httpClient.SendAsync(fetchRequest);
        fetchResponse.EnsureSuccessStatusCode();
        var fetchedPost = await fetchResponse.Content.ReadFromJsonAsync<Post>();
        Assert.NotNull(fetchedPost);
        Assert.Equal(initialPost.Id, fetchedPost.Id);
        Assert.Equal(updatePostDto.Title, fetchedPost.Title);
        Assert.Equal(updatePostDto.Content, fetchedPost.Content);
    }

    [Fact]
    public async Task TestDeletePost()
    {
        // Create a post
        var postData = new CreatePostDto("Test Created Title", "Test Created Content");
        var request = new HttpRequestMessage(HttpMethod.Post, "api/posts");
        request.Content = JsonContent.Create(postData);
        factory.AuthorizeRequest(request);
        var creationResponse = await httpClient.SendAsync(request);
        var post = (await creationResponse.Content.ReadFromJsonAsync<Post>())!;

        // Delete
        var deletionRequest = new HttpRequestMessage(HttpMethod.Delete, $"api/posts/{post.Id}");
        factory.AuthorizeRequest(deletionRequest);
        var deletionResponse = await httpClient.SendAsync(deletionRequest);
        deletionResponse.EnsureSuccessStatusCode();

        // Try fetching the deleted post
        var fetchRequest = new HttpRequestMessage(HttpMethod.Get, $"/api/posts/{post.Id}");
        factory.AuthorizeRequest(fetchRequest);
        var fetchResponse = await httpClient.SendAsync(fetchRequest);
        Assert.Equal(HttpStatusCode.NotFound, fetchResponse.StatusCode);
    }

    [Fact]
    public async Task TestUnauthorized()
    {
        // Get list full
        var response = await httpClient.GetAsync("api/posts");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        // Get list small
        response = await httpClient.GetAsync("api/posts/list");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        // Get by Id
        response = await httpClient.GetAsync("api/posts/1");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        // Create
        var postData = new CreatePostDto("Test Created Title", "Test Created Content");
        var creationRequest = new HttpRequestMessage(HttpMethod.Post, "api/posts");
        creationRequest.Content = JsonContent.Create(postData);
        response = await httpClient.SendAsync(creationRequest);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        // Update
        var updatePostDto = new UpdatePostDto("Test Update Title", "Test Update Content");
        var updateRequest = new HttpRequestMessage(HttpMethod.Put, "api/posts/1");
        updateRequest.Content = JsonContent.Create(updatePostDto);
        response = await httpClient.SendAsync(updateRequest);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        // Delete
        var deletionRequest = new HttpRequestMessage(HttpMethod.Delete, "api/posts/1");
        response = await httpClient.SendAsync(deletionRequest);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
