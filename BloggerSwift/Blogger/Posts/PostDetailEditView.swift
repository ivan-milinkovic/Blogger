import SwiftUI

struct PostDetailEditView: View {
    
//    @Binding var post: Post
//    @Bindable var post: Post
    
    @Environment(ViewModel.self) var vm: ViewModel
    
    var body: some View {
        let _ = Self._printChanges()
//        VStack {
//            TextField("Label", text: $post.title)
//                .font(.title)
//            TextEditor(text: post.content)
//                .font(.system(size: 16))
//        }
        if let post = vm.selectedPost {
            VStack {
                TextField("Label", text: Binding(get: { post.title }, set: { val in vm.selectedPost?.title = val }))
                    .font(.title)
                TextEditor(text: Binding(get: { post.content }, set: { val in vm.selectedPost?.content = val }))
                    .font(.system(size: 16))
            }
        } else {
            Text("No selection")
        }
    }
}
