import { afterEach, test } from "vitest";
import { PostMini } from "../services/BloggerService";
import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/dom";
import Posts from "../Main/Posts/Posts";
import { createMemoryRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

afterEach(cleanup);

test("Posts Load", async () => {
  const posts: PostMini[] = [
    { id: 1, title: "Test 1" },
    { id: 2, title: "Test 2" },
    { id: 3, title: "Test 3" },
  ];
  const url = "http://localhost:5292/api/posts/list";
  fetchMock.mockResponseIf(url, JSON.stringify(posts));

  const queryClient = new QueryClient();

  const postsElement = (
    <QueryClientProvider client={queryClient}>
      <Posts
        selectedId={undefined}
        setSelectedId={() => {}}
        notifyError={() => {}}
        updateTitleFuncProvider={() => {}}
      ></Posts>
    </QueryClientProvider>
  );

  const router = createMemoryRouter([{ path: "*", element: postsElement }]);

  // await act(async () => {
  const screen = render(<RouterProvider router={router} />);
  // });

  await waitFor(
    async () => {
      await screen.getByText("Test 1");
      await screen.getByText("Test 2");
      await screen.getByText("Test 3");
    },
    {
      timeout: 1000.0,
    },
  );
});
