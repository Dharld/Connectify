import { useEffect, useState } from "react";
import communityService from "../../services/communityService";
import RecentPost from "../RecentPosts/RecentPost";
import { Outlet } from "react-router-dom";

export default function Feed() {
  const communities = useState([]);

  useEffect(() => {
    communityService.getAllCommunities();
  }, []);
  return (
    <div className="flex h-full">
      <div className="feed-body flex-1 p-4">
        <Outlet></Outlet>
      </div>
      <RecentPost />
    </div>
  );
}
