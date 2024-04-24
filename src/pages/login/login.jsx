import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/toast.hook";
import { login } from "../../store/slices/auth/auth.actions";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import "./../../App.scss";

const INITIAL_STATE = {
  email: "",
  password: "",
};

export default function Login() {
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (error) {
      showError(error.message);
    }
  }, [error, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      showError("Email and password are required");
      return;
    }
    dispatch(login({ credentials })).then((action) => {
      if (action.error) {
        return;
      }
      showSuccess("You are successfully logged in!");
      setCredentials(INITIAL_STATE);
      navigate("/home");
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div className="input">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={credentials.email}
          onChange={handleChange}
        />
      </div>

      <div className="input">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
