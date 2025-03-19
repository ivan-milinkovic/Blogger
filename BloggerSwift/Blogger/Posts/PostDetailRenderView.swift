import SwiftUI

struct PostDetailRenderView: View {
    
//    let post: Post
    
    @Environment(ViewModel.self) var vm: ViewModel
    
    var body: some View {
//        ScrollView {
//            Text(post.title)
//                .font(.title)
//            Text(LocalizedStringKey(post.content)) // This init will interpret and render markdown
//                .font(.system(size: 16))
//        }
        
        if let post = vm.selectedPost {
            ScrollView {
                Text(post.title)
                    .font(.title)
                Text(LocalizedStringKey(post.content)) // This init will interpret and render markdown
                    .font(.system(size: 16))
            }
        }
    }
}
