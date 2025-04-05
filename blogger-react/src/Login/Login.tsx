import { useNavigate } from "react-router";
import { useAuth } from "../services/AuthContext";
import { strings } from "../localization";

function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  async function loginAction(formData: FormData) {
    const email = formData.get("email")!.toString();
    const password = formData.get("password")!.toString();
    await auth.login(email, password);
    navigate("/");
  }

  return (
    <form action={loginAction} style={{ display: "table" }}>
      <p style={{ display: "table-row" }}>
        <label htmlFor="email" style={{ display: "table-cell" }}>
          {strings.loginEmailLabel}
        </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          defaultValue="ivan@test"
          style={{ display: "table-cell" }}
        />
      </p>
      <p style={{ display: "table-row" }}>
        <label htmlFor="password" style={{ display: "table-cell" }}>
          {strings.loginPasswordLabel}
        </label>
        <input
          type="password"
          name="password"
          placeholder="Email"
          defaultValue="123"
          style={{ display: "table-cell" }}
        />
      </p>
      <p style={{ display: "table-row" }}>
        <button type="submit" style={{ display: "table-cell" }}>
          Login
        </button>
      </p>
    </form>
  );
}

export default Login;
