import { useSelector } from "react-redux";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    user && (
      <section className="home">
        <header>
          <nav>
            <ul className="w-full py-2 px-4 bg-violet-900 flex items-center text-white">
              <div className="flex-1"></div>
              <nav>
                <ul className="w-fullbg-violet-900 flex">
                  <li className="px-4 cursor-pointer hover:text-underline hover:text-red-500">
                    Create a Post
                  </li>
                  <li className="px-4 cursor-pointer hover:text-underline hover:text-red-500">
                    Create a Community
                  </li>
                </ul>
              </nav>
              <div className="px-4">
                <button>Logout</button>
              </div>
              <img
                src={user.profileImg}
                className="w-8 h-8 ring-2 ring-gray-400 rounded-full"
                alt="Profile Icon"
              />
            </ul>
          </nav>
        </header>
      </section>
    )
  );
}
