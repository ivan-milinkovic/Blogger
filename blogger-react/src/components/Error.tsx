import { Link } from "react-router";
import { strings } from "../localization";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Error(error: any) {
  let name: string = "";
  let message: string = "";
  let output: string;

  let err = error;
  if (error.error) {
    // ErrorBoundary wraps errors
    err = error.error;
  }

  if (err.name) {
    name = err.name;
  }

  if (err.message) {
    message = err.message;
  }

  if (name.length == 0 && message.length == 0) {
    output = JSON.stringify(err);
  } else {
    output = name + ": " + message;
  }

  return (
    <div>
      <p>
        {strings.errorShortMessage} <Link to="/">{strings.homeLinkText}</Link>
      </p>
      <p>{output}</p>
    </div>
  );
}
