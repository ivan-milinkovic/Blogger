import Foundation

#if DEBUG

class MockBloggerApi: IBloggerApi {
    
    func auth() async -> Result<String, NetworkingError> {
        .success("")
    }
    
    func loadPosts() async -> Result<[Post], NetworkingError> {
        print("### mock")
        return .success( [Post(id: 1, title: "Test 1", content: "Test content 1"),
                          Post(id: 2, title: "Test 2", content: "Test content 2"),
                          Post(id: 3, title: "Test 3", content: "Test content 3")]
        )
    }
    
    func loadPost(_ id: Int) async -> Result<Post, NetworkingError> {
        .success(
            Post(id: 1, title: "Test", content: "Test content")
        )
    }
    
    func createPost(_ post: Post) async -> Result<Post, NetworkingError> {
        .success(post)
    }
    
    func updatePost(_ post: Post) async -> Result<Post, NetworkingError> {
        .success(post)
    }
    
    func deletePost(_ id: Int) async -> Result<String, NetworkingError> {
        .success("")
    }
}

#endif
