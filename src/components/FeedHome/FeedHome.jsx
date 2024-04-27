import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Post from "../../components/Post/Post";
import { useEffect, useState } from "react";
import { getPosts } from "../../store/slices/post/post.actions";
import { useToast } from "../../hooks/toast.hook";

const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX;

export default function FeedHome() {
  const communities = useSelector((state) => state.community.communities);
  const posts = useSelector((state) => state.post.posts);
  const { showError, showSuccess } = useToast();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts()).then((res) => {
      if (res.error) {
        showError(res.error.message);
        return;
      }
    });
  }, []);

  return (
    <div className="max-w-[800px] w-full mx-auto relative">
      <div className="communities-wrapper bg-white sticky top-0">
        <div className="flex gap-2 my-4">
          {communities.map((community) => (
            <Link
              key={community.id}
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

      <h1 className="secondary-font font-bold text-3xl text-slate-500">
        Posts
      </h1>
      {posts && posts.map((post) => <Post post={post} key={post.POST_ID} />)}
    </div>
  );
}
