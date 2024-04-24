import { useDispatch, useSelector } from "react-redux";
import "./Home.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout as logoutAction } from "../../store/slices/auth/auth.slice";

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for user
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  function logout() {
    dispatch(logoutAction());
  }

  return (
    user && (
      <section className="home">
        <header>
          <nav>
            <ul className="w-full py-2 px-4 bg-violet-900 flex items-center text-white border-b-2 border-b-violet-400">
              <div className="flex-1"></div>
              <nav>
                <ul className="w-fullbg-violet-900 flex">
                  <li className="px-4 cursor-pointer hover:text-underline hover:text-red-500">
                    Create a Post
                  </li>
                </ul>
              </nav>
              <div className="px-4">
                <button onClick={logout}>Logout</button>
              </div>
              <img
                src={user.profileImg}
                className="w-8 h-8 ring-2 ring-gray-400 rounded-full"
                alt="Profile Icon"
              />
            </ul>
          </nav>
        </header>
        <main>
          <div className="sidebar flex">
            <div className="sidebar-header">
              <button>
                <Link to="add-community">Create Community</Link>
              </button>
            </div>
            <Outlet />
          </div>
        </main>
      </section>
    )
  );
}
