import { AuthorizeHeadersFunction } from "./AuthContext";
import { AuthError } from "./Errors";
import { API_URL, commonHeaders } from "./ServiceCommon";

export type Tokens = { tokenType: string; accessToken: string };

export type PostMini = {
  id: number;
  title: string;
};

export type PostFull = {
  id: number;
  title: string;
  content: string;
};

export type PostCreateDto = {
  title: string;
  content: string;
};

export async function loginApi(
  email: string,
  password: string,
): Promise<Tokens> {
  const query = new URLSearchParams({
    useCookies: "false",
    useSessionCookies: "false",
  }).toString();
  const res = await fetch(API_URL + "login?" + query, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({ email, password }),
  });
  const tokens = await res.json();
  return tokens;
}

function checkResponse(res: Response) {
  if (res.ok) return;
  switch (res.status) {
    case 401:
      throw new AuthError();
  }
  throw new Error("Unspecified error");
}

export async function getPosts(
  authorizeHeaders: AuthorizeHeadersFunction,
): Promise<PostMini[]> {
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // see the loader
  const res = await fetch(API_URL + "api/posts/list", {
    method: "GET",
    headers: authorizeHeaders(commonHeaders),
  });
  checkResponse(res);
  const resPosts = await res.json();
  return resPosts;
}

export async function getPost(
  id: number,
  authorizeHeaders: AuthorizeHeadersFunction,
): Promise<PostFull> {
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // see the loader
  const res = await fetch(API_URL + `api/posts/${id}`, {
    method: "GET",
    headers: authorizeHeaders(commonHeaders),
  });
  checkResponse(res);
  const resPost = await res.json();
  return resPost;
}

export async function updatePost(
  post: PostFull,
  authorizeHeaders: AuthorizeHeadersFunction,
): Promise<PostFull> {
  const res = await fetch(API_URL + `api/posts/${post.id}`, {
    method: "PUT",
    headers: authorizeHeaders(commonHeaders),
    body: JSON.stringify({
      Title: post.title,
      Content: post.content,
    }),
  });
  checkResponse(res);
  const resPost = await res.json();
  return resPost;
}

export async function createPost(
  postDto: PostCreateDto,
  authorizeHeaders: AuthorizeHeadersFunction,
): Promise<PostFull> {
  const res = await fetch(API_URL + "api/posts/", {
    method: "POST",
    headers: authorizeHeaders(commonHeaders),
    body: JSON.stringify(postDto),
  });
  checkResponse(res);
  const resPost = await res.json();
  return resPost;
}

export async function deletePost(
  postId: number,
  authorizeHeaders: AuthorizeHeadersFunction,
) {
  await fetch(API_URL + `api/posts/${postId}`, {
    method: "DELETE",
    headers: authorizeHeaders(commonHeaders),
  });
}
