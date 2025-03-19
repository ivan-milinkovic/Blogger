import Foundation
import Observation

@Observable
class ViewModel {
    
    @MainActor var selectedPost: Post? {
        didSet {
            print("ViewModel didSet selectedPost")
        }
    }
    @MainActor var posts: [Post] = []
    let bloggerApi: IBloggerApi
    
    init(bloggerApi: IBloggerApi) {
        self.bloggerApi = bloggerApi
    }
    
    func loadPosts() async {
        let res = await bloggerApi.loadPosts()
        switch res {
        case .success(let postsResp):
            await MainActor.run {
                posts = postsResp
                if posts.isEmpty {
                    selectedPost = nil
                } else {
                    if let selected = selectedPost {
                        selectedPost = posts.first(where: { $0.id == selected.id })
                    } else {
                        selectedPost = posts.first
                    }
                }                
            }
        case .failure(let error):
            print(error)
        }
    }
    
    func createPost() async {
        let newPost = Post(id: 0, title: "New", content: "Content")
        let result = await bloggerApi.createPost(newPost)
        await loadPosts()
        await MainActor.run {
            switch result {
            case .success(let createdPost):
                selectedPost = posts.first { $0.id == createdPost.id }
            case .failure(let error):
                print(error)
            }
        }
    }
    
    func updatePost(_ newPost: Post) async {
        let _ = await bloggerApi.updatePost(newPost)
        await loadPosts()
    }
    
    func deletePost(_ id: Int) async {
        let _ = await bloggerApi.deletePost(id)
        await loadPosts()
    }
    
}
