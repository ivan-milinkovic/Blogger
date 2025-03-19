import SwiftUI

struct PostsSplitView: View {
    
    @Environment(ViewModel.self) var viewModel: ViewModel
    
    var body: some View {
        let _ = Self._printChanges()
        NavigationStack {
            NavigationSplitView {
                PostListView()
            }
            detail: {
                PostDetailView()
            }
        }
    }
}

#Preview {
    PostsSplitView()
        .environment(ViewModel(bloggerApi: MockBloggerApi()))
}
