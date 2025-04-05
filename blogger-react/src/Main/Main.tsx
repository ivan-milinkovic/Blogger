import Posts from "./Posts/Posts";
import Editor from "./Editor/Editor";
import Error from "../components/Error";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link, useParams } from "react-router";
import { useAuth } from "../services/AuthContext";
import { strings } from "../localization";
import { AnyError, AuthError } from "../services/Errors";

export default function Main() {
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [error, setError] = useState<AnyError>(undefined);
  const { hasAuth, logout } = useAuth();
  const [updateTitleFunc, setUpdateTitleFunc] = useState<
    (_id: number, _title: string) => void
  >(function () {});

  // Handling title updates: when the title is changed in the editor, it needs to change in the list (Posts) as well
  // Editor calls back when a title changes. Main calls a function on the Posts component and gives a new title.
  // Main gives a function to Posts, which Posts uses to give its own function back to Main.
  // Alternativelly, lift the posts list state out of Posts and here into Main

  function handleEditorTitleChange(id: number, title: string): void {
    updateTitleFunc(id, title);
  }

  // The Posts component will use this function to provide it's own function that updates a given title
  function updateTitleFunctionProvider(
    updateTitleFunc: (id: number, title: string) => void,
  ) {
    // Can't just setFunc(func) directly,
    // setState has an override to accept a function, and it executes any given function
    setUpdateTitleFunc(() => {
      return updateTitleFunc;
    });
  }

  const { postId } = useParams();
  const postIdNum = Number(postId);
  if (postId && !postIdNum) {
    throw new URIError();
  }
  useEffect(() => {
    if (!hasAuth()) {
      return;
    }
    if (postIdNum) {
      setSelectedId(postIdNum);
    } else {
      setSelectedId(undefined);
    }
  }, [postIdNum, setSelectedId]);

  function notifyError(err: AnyError) {
    if (err instanceof AuthError) {
      logout();
    }
    setError(err);
  }

  if (!hasAuth()) {
    return <Link to="/login">{strings.loginLinkText}</Link>;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <main className="main">
      <ErrorBoundary
        fallbackRender={(props) => {
          return <Error error={props.error} />;
        }}
        onError={(error) => {
          notifyError(error);
        }}
      >
        <Posts
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          notifyError={notifyError}
          updateTitleFuncProvider={updateTitleFunctionProvider}
        />
        {selectedId ? (
          <Editor
            postId={selectedId}
            handleError={notifyError}
            handleTitleChange={handleEditorTitleChange}
          />
        ) : (
          <p>Select a post</p>
        )}
      </ErrorBoundary>
    </main>
  );
}
