import { PostCreateDto } from "../model/PostCreateDto";
import { PostFull } from "../model/PostFull";
import { PostMini } from "../model/PostMini";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "./apiFunctions";
import { useAuthApiAxios } from "./useAuthApiAxios";

export function useGetPosts() {
  const authorizedApiAxios = useAuthApiAxios();
  return async (): Promise<PostMini[]> => {
    return await getPosts(authorizedApiAxios);
  };
}

export function useGetPost() {
  const authorizedApiAxios = useAuthApiAxios();
  return async (id: number): Promise<PostFull> => {
    return await getPost(authorizedApiAxios, id);
  };
}

export function useUpdatePost() {
  const authorizedApiAxios = useAuthApiAxios();
  return async (post: PostFull): Promise<PostFull> => {
    return updatePost(authorizedApiAxios, post);
  };
}

export function useCreatePost() {
  const authorizedApiAxios = useAuthApiAxios();
  return async (postDto: PostCreateDto): Promise<PostFull> => {
    return createPost(authorizedApiAxios, postDto);
  };
}

export function useDeletePost() {
  const authorizedApiAxios = useAuthApiAxios();
  return async (postId: number) => {
    return deletePost(authorizedApiAxios, postId);
  };
}
