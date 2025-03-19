import SwiftUI

struct PostListView: View {
    
    @Environment(ViewModel.self) var vm: ViewModel
    @State var isLoading = false
    
    var body: some View {
        let _ = Self._printChanges()
        List(vm.posts) { post in
            VStack(spacing: 0) {
                Text(post.title)
                    .padding(0)
                    .onTapGesture {
                        vm.selectedPost = post
                    }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background( vm.selectedPost?.id == post.id
                         ? Color.accentColor : .clear
            )
            .contextMenu {
                Button("Delete") {
                    Task {
                        await vm.deletePost(post.id)
                    }
                }
            }
        }
        .toolbar {
            ToolbarItemGroup(placement: .navigation) {
                Button("Refresh", systemImage: "arrow.clockwise") {
                    Task {
                        await vm.loadPosts()
                    }
                }
                
                Button("Add", systemImage: "plus") {
                    Task {
                        await vm.createPost()
                    }
                }
            }
        }
        .task {
            await vm.loadPosts()
        }
    }
}
