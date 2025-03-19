import SwiftUI

@main
struct BloggerApp: App {
    
    @ObservedObject var userSession = DI.shared.userSession
    
    var body: some Scene {
        WindowGroup {
            if userSession.isLoggedIn {
                PostsSplitView()
                    .environment(DI.shared.viewModel)
                    .toolbar {
                        ToolbarItem(placement: .primaryAction) {
                            Button("Logout") {
                                userSession.logout()
                            }
                        }
                    }
            } else {
                LoginView(userSession: userSession)
            }
        }
    }
}
