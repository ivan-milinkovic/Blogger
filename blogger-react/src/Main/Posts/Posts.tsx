import { useEffect } from "react";
import {
  useCreatePost,
  useDeletePost,
  useGetPosts,
} from "../../services/apiHooks";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router";
import { strings, formatString } from "../../localization";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnyError } from "../../services/Errors";
import "./Posts.css";

interface Props {
  selectedId: number | undefined;
  setSelectedId: React.Dispatch<React.SetStateAction<number | undefined>>;
  notifyError: (err: AnyError) => void;
  updateTitleFuncProvider: (
    updateTitle: (id: number, title: string) => void,
  ) => void;
}

function Posts({ selectedId, notifyError, updateTitleFuncProvider }: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const getPosts = useGetPosts();
  const createPost = useCreatePost();
  const deletePost = useDeletePost();

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    retry: 0,
    throwOnError: true,
    // staleTime: 1,
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: loadPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      loadPosts();
      navigate("/");
    },
  });

  function updateTitle() {
    loadPosts();
  }

  async function loadPosts() {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  async function createNewPost() {
    createMutation.mutateAsync({
      title: strings.newPostTitle,
      content: strings.newPostContent,
    });
  }

  function promptDeleteSelectedPost() {
    const posts = postsQuery.data;
    if (!posts) {
      return;
    }
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
      deleteMutation.mutate(postItem.id);
    }
  }

  function itemClass(id: number | undefined): string {
    return id == selectedId ? "posts-list-item-selected" : "posts-list-item";
  }

  useEffect(() => {
    updateTitleFuncProvider(updateTitle);
  }, []);

  // Propagate errors
  useEffect(() => {
    if (postsQuery.error) notifyError(postsQuery.error);
    if (createMutation.error) notifyError(createMutation.error);
    if (deleteMutation.error) notifyError(deleteMutation.error);
  }, [postsQuery, createMutation, deleteMutation]);

  const posts = postsQuery.data;
  const isLoading =
    postsQuery.isLoading ||
    createMutation.isPending ||
    deleteMutation.isPending ||
    !posts;

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
                  <span className="posts-list-post-id">
                    &nbsp;(id: {post.id})
                  </span>
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
