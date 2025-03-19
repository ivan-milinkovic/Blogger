import Foundation

protocol IBloggerApi {
    func loadPosts() async -> Result<[Post], NetworkingError>
    func loadPost(_ id: Int) async -> Result<Post, NetworkingError>
    func createPost(_ post: Post) async -> Result<Post, NetworkingError>
    func updatePost(_ post: Post) async -> Result<Post, NetworkingError>
    func deletePost(_ id: Int) async -> Result<String, NetworkingError>
}

class BloggerApi: IBloggerApi {
    
    let apiUrl: URL
    let httpClient : HttpClient
    
    init(apiUrl: URL, httpClient: HttpClient) {
        self.apiUrl = apiUrl
        self.httpClient = httpClient
    }
    
    func loadPosts() async -> Result<[Post], NetworkingError> {
        // print("### real")
        let url = apiUrl.appendingPathComponent("api/posts")
        return await httpClient.load(url)
    }
    
    func loadPost(_ id: Int) async -> Result<Post, NetworkingError> {
        let url = apiUrl.appendingPathComponent("api/posts/\(id)")
        return await httpClient.load(url)
    }
    
    func createPost(_ post: Post) async -> Result<Post, NetworkingError> {
        let url = apiUrl.appendingPathComponent("api/posts")
        do {
            let data = try JSONEncoder().encode(post)
            return await httpClient.load(url, method: "POST", body: data)
        } catch let error {
            return .failure(.serialization(error))
        }
    }
    
    func updatePost(_ post: Post) async -> Result<Post, NetworkingError> {
        let url = apiUrl.appendingPathComponent("api/posts/\(post.id)")
        do {
            let body = try JSONEncoder().encode(post)
            return await httpClient.load(url, method: "PUT", body: body)
        } catch let error {
            return .failure(.serialization(error))
        }
    }
    
    func deletePost(_ id: Int) async -> Result<String, NetworkingError> {
        let url = apiUrl.appendingPathComponent("api/posts/\(id)")
        return await httpClient.load(url, method: "DELETE")
    }
}
