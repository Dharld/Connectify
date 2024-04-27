import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout as logoutAction } from "../../store/slices/auth/auth.slice";
import Sidebar from "../../components/Sidebar/Sidebar";

import "./Home.scss";

const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX;

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
      <section className="home h-[90vh]">
        <header className="z-50 sticky top-0 bg-white">
          <nav>
            <ul className="w-full py-4 px-4 flex items-center text-white border-b border-b-slate-100">
              <Link to="/home">
                <div className="logo font-extrabold text-slate-800 text-xl italic">
                  Connect<span className="text-violet-800">HUB</span>{" "}
                </div>
              </Link>

              <div className="flex-1"></div>
              <nav>
                <ul className="w-fullbg-violet-900 flex">
                  {/*                   <li className="px-4 cursor-pointer hover:text-underline hover:text-red-500">
                    Create a Post
                  </li> */}
                </ul>
              </nav>
              <div className="px-4">
                <button onClick={logout}>Logout</button>
              </div>
              <img
                src={imagePrefix + user.profileImg}
                className="w-8 h-8 ring-2 ring-gray-400 rounded-full object-cover"
                alt="Profile Icon"
              />
            </ul>
          </nav>
        </header>
        <main className="flex h-full">
          <div className="sidebar-container h-full">
            <Sidebar />
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </section>
    )
  );
}
