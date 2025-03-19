import Foundation

class UserSession: ObservableObject {
    @Published var isLoggedIn = false
    private var tokens: Tokens?
    private let tokensKey = "tokens"
    private let userDefaults: IUserDefaults
    private let apiUrl: URL
    private let httpClient: HttpClient
    
    init(userDefaults: IUserDefaults, apiUrl: URL, httpClient: HttpClient) {
        self.userDefaults = userDefaults
        self.apiUrl = apiUrl
        self.httpClient = httpClient
        self.tokens = tryLoadTokens()
        self.isLoggedIn = tokens != nil
    }
    
    func decorateRequest(request: inout URLRequest) {
        guard let tokens else { return }
        request.addValue("\(tokens.tokenType) \(tokens.accessToken)", forHTTPHeaderField: "Authorization")
    }
    
    func login(email: String, password: String) async throws(NetworkingError) {
        let url = apiUrl.appendingPathComponent("login")
        do {
            let bodyDict = ["email": email, "password": password]
            let bodyData = try JSONEncoder().encode(bodyDict)
            let res: Result<Tokens, NetworkingError> = await httpClient.load(url, method: "POST", body: bodyData)
            
            switch res {
            case .failure(let error):
                throw error
            case .success(let newTokens):
                tokens = newTokens
                storeTokens()
                isLoggedIn = true
            }
            
        } catch let error {
            throw .serialization(error)
        }
    }
    
    func logout() {
        userDefaults.removeObject(forKey: tokensKey)
        tokens = nil
        isLoggedIn = false
    }
    
    private func storeTokens() {
        do {
            let data = try JSONEncoder().encode(tokens)
            userDefaults.set(data, forKey: tokensKey)
        } catch {
            print("UserSession", error)
        }
    }
    
    private func tryLoadTokens() -> Tokens? {
        guard let data = userDefaults.object(forKey: tokensKey) as? Data else {
            return nil
        }
        do {
            return try JSONDecoder().decode(Tokens.self, from: data)
        } catch {
            print("UserSession", error)
        }
        return nil
    }
}

struct Tokens: Codable {
    let tokenType: String
    let accessToken: String
}
