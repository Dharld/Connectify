import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Post from "../../components/Post/Post";
import { useEffect, useState } from "react";
import {
  getPosts,
  getPostsSortedByDate,
  getPostsSortedByUpvote,
} from "../../store/slices/post/post.actions";
import { useToast } from "../../hooks/toast.hook";

import "./FeedHome.scss";

const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX;

export default function FeedHome() {
  const communities = useSelector((state) => state.community.communities);
  const posts = useSelector((state) => state.post.posts);
  const { showError, showSuccess } = useToast();

  const dispatch = useDispatch();

  const loading = useSelector((state) => state.post.loading);

  const sortByDate = () => {
    dispatch(getPostsSortedByDate());
  };

  const sortByUpvote = () => {
    dispatch(getPostsSortedByUpvote());
  };

  useEffect(() => {
    dispatch(getPosts()).then((res) => {
      if (res.error) {
        showError(res.error.message);
        return;
      }
    });
  }, []);

  return (
    <div className="max-w-[800px] w-full h-full mx-auto relative">
      <div className="communities-wrapper bg-white">
        <div className="flex gap-2 my-4">
          {communities.map((community) => (
            <Link
              key={community.COMMUNITY_ID}
              to={"communities/" + community.COMMUNITY_NAME}
            >
              <div>
                <img
                  src={imagePrefix + community.COMMUNITY_AVATAR_SRC}
                  alt=""
                  className="w-[150px] h-[150px] rounded-lg ring-3 ring-violet-400 bg-slate-100 object-cover"
                />
                <div className="text-slate-700">{community.COMMUNITY_NAME}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="tabs text-slate-500 my-2">
        <div className="secondary-font font-bold">Sort By</div>
        <ul className="flex py-1 border-b border-b-slate-200">
          <li onClick={sortByDate}>Date</li>
          <li onClick={sortByUpvote}>Upvote</li>
        </ul>
      </div>

      {loading ? (
        <div className="w-full h-full grid place-items-center -mt-44">
          <div className="spinner spinner-small"></div>
        </div>
      ) : posts.length === 0 ? (
        <div>No Posts</div>
      ) : (
        posts.map((post) => <Post post={post} key={post.POST_ID} />)
      )}
    </div>
  );
}
