import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
import Header from "./Header";
import Main from "../pages/Main/Main";
import Footer from "./Footer";
import Error from "../components/Error";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AuthProvider from "../services/AuthProvider";
import { setupSavedLocale } from "../localization";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Header />
        <Outlet />
        <Footer />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function App() {
  setupSavedLocale(); // can't use useEffect, it's late for some components

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <Error />,
      children: [
        {
          path: ":postId?",
          element: <Main />,
          errorElement: <Error />,
        },
        {
          path: "login",
          element: <Login />,
          errorElement: <Error />,
        },
        {
          path: "register",
          element: <Register />,
          errorElement: <Error />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
