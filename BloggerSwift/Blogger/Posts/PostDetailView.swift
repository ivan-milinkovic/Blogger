import SwiftUI

struct PostDetailView: View {
    
    @Environment(ViewModel.self) var vm: ViewModel
    @State var isLoading = false
    
    #if os(iOS)
    @State var viewMode = ViewMode.render
    
    enum ViewMode {
        case source
        case render
    }
    #endif
    
    var body: some View {
        let _ = Self._printChanges()
//        if let post = vm.selectedPost {
        if true {
            VStack {
#if os(macOS)
                VSplitView {
//                    PostDetailEditView(post: Binding(get: { post }, set: { v in vm.selectedPost = v }))
//                    PostDetailEditView(post: post)
                    PostDetailEditView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
//                    PostDetailRenderView(post: post)
                    PostDetailRenderView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                }
                
#elseif os(iOS)
                Picker("", selection: $viewMode) {
                    Text("Edit").tag(ViewMode.source)
                    Text("Render").tag(ViewMode.render)
                }
                if viewMode == .source {
                    PostDetailEditView(post: $post)
                } else {
                    PostDetailRenderView(post: post)
                }
#else
                EmptyView()
#endif
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .overlay(content: {
                if isLoading {
                    ProgressView()
                } else {
                    EmptyView()
                }
            })
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("Save") {
                        isLoading = true
                        Task {
                            await vm.updatePost(vm.selectedPost!)
                            await update()
                        }
                    }
                }
            }
        }
        else {
            Text("Select a post")
        }
    }
    
    @MainActor
    private func update() async {
        isLoading = false
    }
}
