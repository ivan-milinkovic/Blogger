import "./Header.css";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../services/AuthContext";
import { strings } from "../localization";

export default function Header() {
  return (
    <header className="header">
      <div className="header-row">
        <h1 className="header-name">{strings.title}</h1>
        <AuthSection />
      </div>
      <hr className="divider" />
    </header>
  );
}

function AuthSection() {
  const navigate = useNavigate();
  const auth = useAuth();

  function logoutAction() {
    auth.logout().then(() => {
      navigate("/login");
    });
  }

  const isLoggedIn = auth.hasAuth();
  if (isLoggedIn) {
    return (
      <div className="header-auth">
        <Link to="/">{strings.homeLinkText}</Link>
        &nbsp;
        <button onClick={logoutAction}>{strings.logoutLinkText}</button>
      </div>
    );
  } else {
    return (
      <div className="header-auth">
        <Link to="/">{strings.homeLinkText}</Link>
        &nbsp;
        <Link to="/login">{strings.loginLinkText}</Link>
        &nbsp;
        <Link to="/register">{strings.registerLinkText}</Link>
      </div>
    );
  }
}
