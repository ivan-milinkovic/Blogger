import axios, { AxiosInstance } from "axios";
import { API_URL, jsonHeaders } from "./ServiceCommon";
import { Tokens } from "../model/Tokens";
import { PostMini } from "../model/PostMini";
import { PostFull } from "../model/PostFull";
import { PostCreateDto } from "../model/PostCreateDto";

export async function loginApi(
  email: string,
  password: string,
): Promise<Tokens> {
  const query = new URLSearchParams({
    useCookies: "false",
    useSessionCookies: "false",
  }).toString();

  const url = API_URL + "/login?" + query;
  const data = JSON.stringify({ email, password });
  const res = await axios({
    method: "POST",
    url: url,
    headers: jsonHeaders,
    data: data,
  });
  const tokens = res.data;
  return tokens;
}

export async function refreshApi(refreshToken: string): Promise<Tokens> {
  const url = API_URL + "/refresh";
  const data = JSON.stringify({ refreshToken: refreshToken });
  var res = await axios({
    method: "POST",
    url: url,
    headers: jsonHeaders,
    data: data,
  });
  var newTokens = res.data as Tokens;
  return newTokens;
}

export async function getPosts(axios: AxiosInstance): Promise<PostMini[]> {
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // see the loader
  const url = API_URL + "/api/posts/list";
  const res = await axios.get(url);
  const resPosts = (await res.data) as PostMini[];
  return resPosts;
}

export async function getPost(
  axios: AxiosInstance,
  id: number,
): Promise<PostFull> {
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // see the loader
  const url = API_URL + `/api/posts/${id}`;
  const res = await axios.get(url);
  const resPost = (await res.data) as PostFull;
  return resPost;
}

export async function updatePost(
  axios: AxiosInstance,
  post: PostFull,
): Promise<PostFull> {
  const url = API_URL + `/api/posts/${post.id}`;
  const data = JSON.stringify({
    Title: post.title,
    Content: post.content,
  });
  const res = await axios({
    method: "PUT",
    url: url,
    data: data,
  });
  const resPost = res.data as PostFull;
  return resPost;
}

export async function createPost(
  axios: AxiosInstance,
  postDto: PostCreateDto,
): Promise<PostFull> {
  const url = API_URL + "/api/posts/";
  const res = await axios.post(url, JSON.stringify(postDto));
  const resPost = (await res.data) as PostFull;
  return resPost;
}

export async function deletePost(axios: AxiosInstance, postId: number) {
  const url = API_URL + `/api/posts/${postId}`;
  await axios.delete(url);
}
