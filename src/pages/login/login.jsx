import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/toast.hook";
import { login } from "../../store/slices/auth/auth.actions";
import { Link, useNavigate } from "react-router-dom";
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
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

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
    <form
      onSubmit={handleSubmit}
      className="grid items-center w-full h-[100vh] place-items-center my-auto"
    >
      <div className="wrapper w-full max-w-[500px] mx-auto">
        <h1 className="secondary-font font-bold text-2xl">Login</h1>
        <div className="input my-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>

        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        <div className="already-account text-right mt-4">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-underline text-violet-700">
              Sign up
            </Link>
          </p>
        </div>
        <button
          type="submit"
          className="w-full mt-10 flex justify-center items-center"
        >
          {loading ? (
            <div className="spinner spinner-extra-small"></div>
          ) : (
            <div>Login</div>
          )}
        </button>
      </div>
    </form>
  );
}
