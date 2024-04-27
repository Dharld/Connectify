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
          key={recent.post_id}
        >
          <Link
            to={`communities/${recent.community_name}/posts/${recent.post_id}`}
          >
            <div className="w-fit rounded-full border border-slate-100 px-4 py-1 text-sm mb-2 hover:bg-violet-500 hover:text-white transition-colors">
              {recent.community_name}
            </div>
            <div className="flex gap-1">
              <img
                src={imagePrefix + recent.user_profile_src}
                alt=""
                className="w-6 h-6 object-cover rounded-full flex-shrink-0"
              />
              <div className="content">
                <h2 className="secondary-font font-bold">
                  {recent.post_title}
                </h2>
                <p>
                  {recent.post_content.length < 200
                    ? recent.post_content
                    : recent.post_content.slice(0, 200) + "..."}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
