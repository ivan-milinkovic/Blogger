// Manually calling fetch

import { useEffect, useState } from "react";
import {
  PostMini,
  createPost,
  deletePost,
  getPosts,
} from "../../services/BloggerService";
import Loading from "../../components/Loading";
import "./Posts.css";
import { useNavigate } from "react-router";
import { useAuth } from "../../services/AuthContext";
import { strings, formatString } from "../../localization";
import { AnyError } from "../../services/Errors";

interface Props {
  selectedId: number | undefined;
  setSelectedId: React.Dispatch<React.SetStateAction<number | undefined>>;
  notifyError: (err: AnyError) => void;
  updateTitleFuncProvider: (
    updateTitle: (id: number, title: string) => void,
  ) => void;
}

function Posts({
  selectedId,
  setSelectedId,
  notifyError,
  updateTitleFuncProvider,
}: Props) {
  const [posts, setPosts] = useState<PostMini[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authorizeHeaders } = useAuth();
  const navigate = useNavigate();

  function updateTitle(id: number, title: string) {
    const updatedPosts = [...posts];
    const i = posts.findIndex((p) => {
      return p.id === id;
    });
    posts[i].title = title;
    setPosts(updatedPosts);
  }

  useEffect(() => {
    updateTitleFuncProvider(updateTitle);
  }, [posts]); // updateTitle needs to capture the new posts value

  async function loadPosts() {
    setIsLoading(true);
    try {
      const resPosts = await getPosts(authorizeHeaders);
      setPosts(resPosts);
    } catch (err) {
      setPosts([]);
      notifyError(err);
      console.log("***", err); // test support, the error doesn't propagate in tests
    } finally {
      setIsLoading(false);
    }
  }

  async function createNewPost() {
    setIsLoading(true);
    try {
      await createPost(
        { title: strings.newPostTitle, content: strings.newPostContent },
        authorizeHeaders,
      );
    } catch (err) {
      notifyError(err);
    }
    await loadPosts();
  }

  function promptDeleteSelectedPost() {
    const postItem = posts.find((p) => {
      return p.id === selectedId;
    });
    if (!postItem) {
      return;
    }
    const confirmDeletionText = formatString(
      "confirmDeletion",
      postItem.title,
      postItem.id.toString(),
    );
    if (confirm(confirmDeletionText) == true) {
      deleteSelectedPost();
    }
  }

  async function deleteSelectedPost() {
    if (!selectedId) {
      return;
    }
    setIsLoading(true);
    try {
      await deletePost(selectedId, authorizeHeaders);
      await navigate("/");
    } catch (err) {
      notifyError(err);
    } finally {
      setSelectedId(undefined);
    }
    await loadPosts();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function itemClass(id: number | undefined): string {
    return id == selectedId ? "posts-list-item-selected" : "posts-list-item";
  }

  return (
    <nav className="posts">
      <div className="posts-actions-toolbar">
        <button className="refresh-posts-action" onClick={loadPosts}>
          ↺
        </button>
        <button className="create-new-post-action" onClick={createNewPost}>
          +
        </button>
        <button
          className="delete-post-action"
          onClick={promptDeleteSelectedPost}
        >
          -
        </button>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ul className="posts-list">
            {posts.map((post) => {
              return (
                <li
                  key={post.id}
                  className={itemClass(post.id)}
                  onClick={() => {
                    // setSelectedId(post.id);
                    navigate(`/${post.id}`);
                  }}
                >
                  <span>{post.title}</span>
                  <span>&nbsp;({post.id})</span>
                  <hr className="divider" />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Posts;
