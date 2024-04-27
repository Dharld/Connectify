import { useEffect, useState } from "react";
import RecentPost from "../RecentPosts/RecentPost";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllCommunities } from "../../store/slices/community/community.actions";

import "./Feed.scss";
import { getPosts } from "../../store/slices/post/post.actions";
import { useToast } from "../../hooks/toast.hook";

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all([dispatch(getAllCommunities()), dispatch(getPosts())]).then(
      () => {
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="px-4 w-full h-full grid place-items-center -mt-6">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="feed-body flex-1 px-4 overflow-scroll">
        <Outlet></Outlet>
      </div>
      <div className="right">
        <RecentPost className />
      </div>
    </div>
  );
}
