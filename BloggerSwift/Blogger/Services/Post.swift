import Foundation

// On macos, if Post is a struct, changes in the edit view triggers changes of the view model selected post, and this resets the view and jumps the cursor to the end of text
// Class does not trigger the view model setter, so the view doesn't re-render
// Try a struct by using TextEditor selection binding

//@Observable
final class
//struct
Post: Codable, Identifiable {
    
    var id: Int
    var title: String
    var content: String
    
    init(id: Int, title: String, content: String) {
        self.id = id
        self.title = title
        self.content = content
    }
    
    static func == (lhs: Post, rhs: Post) -> Bool {
        return lhs.id == rhs.id
        && lhs.title == rhs.title
        && lhs.content == rhs.content
    }
    
//    enum CodingKeys: String, CodingKey {
//        case _id = "id"
//        case _title = "title"
//        case _content = "content"
//    }
}
