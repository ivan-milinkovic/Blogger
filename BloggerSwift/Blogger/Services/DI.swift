import Foundation

class DI {
    
    static let shared = DI()
    
    let API_URL = URL(string: "http://localhost:5292")!
    let userDefaults: IUserDefaults
    let basicHttpClient: HttpClient
    let authHttpClient: HttpClient
    let userSession: UserSession
    let bloggerApi: BloggerApi
    let viewModel: ViewModel
    
    init() {
        userDefaults = UserDefaults.standard
        basicHttpClient = HttpClient(urlSession: URLSession.shared)
        userSession = UserSession(userDefaults: userDefaults, apiUrl: API_URL, httpClient: basicHttpClient)
        authHttpClient = HttpClient(urlSession: URLSession.shared, decorateRequest: userSession.decorateRequest)
        bloggerApi = BloggerApi(apiUrl: API_URL, httpClient: authHttpClient)
        viewModel = ViewModel(bloggerApi: bloggerApi)
    }
}
