import { useEffect, useState } from "react";
import {
  PostFull,
  useGetPost,
  useUpdatePost,
} from "../../services/BloggerService";
import Markdown from "react-markdown";
import Loading from "../../components/Loading";
import { strings } from "../../localization";
import "./Editor.css";

interface Props {
  postId: number;
  handleError: (err: unknown) => void;
  handleTitleChange: (id: number, title: string) => void;
}

function Editor({
  postId,
  handleError: notifyError,
  handleTitleChange,
}: Props) {
  const [post, setPost] = useState<PostFull | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const getPost = useGetPost();
  const updatePost = useUpdatePost();

  async function loadPost() {
    setIsLoading(true);
    try {
      const resPost = await getPost(postId);
      setPost(resPost);
    } catch (err) {
      setPost(undefined);
      notifyError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPost();
  }, [postId]);

  if (isLoading) {
    return <Loading />;
  }
  if (!post) {
    return (
      <p>
        Something went wrong. <a href="/">Reload</a>
      </p>
    );
  }

  async function save() {
    if (!post) return;
    setIsLoading(true);
    const title = (document.getElementById("post-title")! as HTMLInputElement)
      .value!;

    const content = (
      document.getElementById("post-content")! as HTMLTextAreaElement
    ).value!;
    const updatedPost: PostFull = {
      id: post.id,
      title: title,
      content: content,
    };

    try {
      const resPost = await updatePost(updatedPost);
      setPost(resPost);

      if (post.title !== resPost.title) {
        handleTitleChange(resPost.id, resPost.title);
      }
    } catch (err) {
      notifyError(err);
    } finally {
      setIsLoading(false);
    }
  }

  function onContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setPost((prev) => {
      if (!prev) {
        return undefined;
      }
      return { ...prev, content: e.target.value };
    });
  }

  return (
    <section className="editor-section" key={post.id}>
      <div className="editor-vertical-split">
        <div className="editor-inputs">
          <div className="editor-title">
            <span className="editor-toolbar">
              <button
                className="editor-save-button"
                type="submit"
                onClick={save}
              >
                {strings.saveActionText}
              </button>
            </span>
            <input id="post-title" type="text" defaultValue={post.title} />
          </div>
          <div className="editor-content">
            <textarea
              id="post-content"
              name="content"
              defaultValue={post.content}
              onChange={onContentChange}
            ></textarea>
          </div>
        </div>
        <div className="editor-preview">
          <div className="editor-preview-label">{strings.preview}</div>
          <div className="editor-preview-markdown-container">
            <Markdown>{post.content}</Markdown>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Editor;
