import Foundation

class HttpClient {
    
    let urlSession: URLSession
    var decorateRequest: ((inout URLRequest) -> Void)?
    
    init(urlSession: URLSession, decorateRequest: ((inout URLRequest) -> Void)? = nil) {
        self.urlSession = urlSession
        self.decorateRequest = decorateRequest
    }
    
    func loadUrl(_ url: URL, method: String = "GET", body: Data? = nil) async -> Result<Data, NetworkingError> {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = body
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        decorateRequest?(&request)
        
        do {
            
            let (data, response) = try await urlSession.data(for: request)
            let httpResponse = response as! HTTPURLResponse
            let statusCode = httpResponse.statusCode
            log(request, httpResponse)
            return handleStatusCode(statusCode, data: data)
            
        } catch let error {
            return .failure(.connection(error))
        }
    }
    
    private func handleStatusCode(_ statusCode: Int, data: Data) -> Result<Data, NetworkingError> {
        switch statusCode {
        case 200...299:
            return .success(data)
        case 401:
            return .failure(.unauthorized)
        default:
            return .failure(.generic)
        }
    }
    
    private func log(_ request: URLRequest, _ response: HTTPURLResponse) {
        if (200...299).contains(response.statusCode) {
            return
        }
        print("HttpClient: \(request.httpMethod as Any) \(request.url as Any)")
        print("\theaders:", request.allHTTPHeaderFields as Any)
        if let body = request.httpBody {
            print("\t", String(data: body, encoding: .utf8) as Any)
        }
        print("\tstatus: \(response.statusCode)")
        print("\theaders:", response.allHeaderFields)
    }
    
    func load<T: Decodable>(_ url: URL, method: String = "GET", body: Data? = nil) async -> Result<T, NetworkingError> {
        let res = await loadUrl(url, method: method, body: body)
        
        switch res {
        case .failure(let error):
            return .failure(error)
            
        case .success(let data):
            let result: Result<T, NetworkingError> = decode(data)
            return result
        }
    }
    
    private func decode<T: Decodable>(_ data: Data) -> Result<T, NetworkingError> {
        do {
            let entities = try JSONDecoder().decode(T.self, from: data)
            return .success(entities)
        }
        catch let error {
            return .failure(.serialization(error))
        }
    }
}
