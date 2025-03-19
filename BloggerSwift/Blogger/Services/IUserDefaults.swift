import Foundation

protocol IUserDefaults {
    func set(_ value: Any?, forKey defaultName: String)
    func object(forKey defaultName: String) -> Any?
    func string(forKey defaultName: String) -> String?
    func removeObject(forKey defaultName: String)
}

extension UserDefaults: IUserDefaults { }
