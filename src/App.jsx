import { Outlet, useNavigate } from "react-router-dom";
import "./App.scss";
import "./index.scss";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, []);
  return <Outlet />;
}

export default App;
