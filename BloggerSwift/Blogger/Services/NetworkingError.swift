import Foundation

enum NetworkingError: Error {
    case generic
    case unauthorized
    case connection(Error)
    case serialization(Error)
}
