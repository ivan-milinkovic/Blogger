
// Just to have another test, and see how factory init/dispose behave when called multiple times

public class RootTest : IClassFixture<IntegrationWebApplicationFactory>
{
    private IntegrationWebApplicationFactory factory;
    private HttpClient httpClient;

    public RootTest(IntegrationWebApplicationFactory factory)
    {
        this.factory = factory;
        httpClient = factory.CreateClient();
        factory.Login().Wait(); // Make it use the database (not needed otherwise)
    }

    [Fact]
    public async Task TestRoot()
    {
        var response = await httpClient.GetAsync("/");
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadAsStringAsync();
        Assert.Equal("root", body);
    }
}