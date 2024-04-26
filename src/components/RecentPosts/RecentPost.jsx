import { useEffect, useState } from "react";
import postService from "./../../services/postService";
import "./RecentPost.scss";
import { Link } from "react-router-dom";

const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX;

export default function RecentPost() {
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    postService.getRecentPosts().then((recents) => {
      setRecents(recents);
    });
  }, []);

  return (
    <div className="recents">
      <h1 className="font-bold secondary-font">Recent Posts</h1>
      {recents.map((recent) => (
        <div
          className="border rounded p-3 my-2 cursor-pointer hover:bg-slate-100 transition-colors"
          key={recent.POST_ID}
        >
          <Link
            to={`communities/${recent.Community.COMMUNITY_NAME}/posts/${recent.POST_ID}`}
          >
            <div className="w-fit rounded-full border border-slate-100 px-4 py-1 text-sm mb-2 hover:bg-violet-500 hover:text-white transition-colors">
              {recent.Community.COMMUNITY_NAME}
            </div>
            <div className="flex gap-1">
              <img
                src={imagePrefix + recent.User.USER_PROFILE_SRC}
                alt=""
                className="w-6 h-6 object-cover rounded-full flex-shrink-0"
              />
              <div className="content">
                <h2 className="secondary-font font-bold">
                  {recent.POST_TITLE}
                </h2>
                <p>
                  {recent.POST_CONTENT.length < 200
                    ? recent.POST_CONTENT
                    : recent.POST_CONTENT.slice(0, 200) + "..."}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
