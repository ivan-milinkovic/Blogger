import SwiftUI

struct LoginView: View {
    
    let userSession: UserSession
    @State var email = "ivan@test"
    @State var passwod = "123"
    @State var errorMessage: String?
    
    var body: some View {
        VStack {
            Form {
                TextField("Email", text: $email)
                SecureField("Password", text: $passwod)
                Button("login") {
                    Task {
                        do {
                            try await userSession.login(email: email, password: passwod)
                        } catch let error as NetworkingError {
                            errorMessage = error.localizedDescription
                        }
                    }
                }
            }
            .padding()
            if let errorMessage {
                HStack {
                    Text("Error: \(errorMessage)")
                    Button("X") {
                        self.errorMessage = nil
                    }
                }
            }
        }
    }
}
