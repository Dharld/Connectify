/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import dateUtils from "../../utils/dateUtils";
import stringUtils from "../../utils/stringUtils";
import { likePost, unlikePost } from "../../store/slices/post/post.actions";
import { useEffect, useState } from "react";
import "./Post.scss";

const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX;

export default function Post({ post }) {
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(-1);

  const { id: currentUserId } = useSelector((state) => state.auth.user);
  const formattedCreatedAt = dateUtils.formatToNow(post.POST_CREATED_AT);
  const {
    POST_ID: id,
    POST_TITLE: title,
    POST_CONTENT: content,
    POST_IMAGE_SRC: image,
    User: user,
    Upvote: likes,
  } = post;
  const {
    USER_ID: userId,
    USER_EMAIL: email,
    USER_PROFILE_SRC: profileSrc,
  } = user;

  useEffect(() => {
    const liked = likes.some((l) => l.USER_ID === currentUserId);
    setNumberOfLikes(likes.length);
    setAlreadyLiked(liked);
  }, [currentUserId, setAlreadyLiked, likes]);

  const dispatch = useDispatch();

  const handleLikeClick = () => {
    if (alreadyLiked) {
      dispatch(unlikePost({ userId: currentUserId, postId: id }));
      setNumberOfLikes(numberOfLikes > 0 ? numberOfLikes - 1 : numberOfLikes);
    } else {
      dispatch(likePost({ userId: currentUserId, postId: id }));
      setNumberOfLikes(numberOfLikes + 1);
    }

    setAlreadyLiked(!alreadyLiked);
  };

  return (
    <div className="border-b-2 border-b-slate-100 w-full px-4 py-4 rounded-md">
      <div className="text-sm text-slate-500">
        {stringUtils.capitalize(formattedCreatedAt)}
      </div>
      <div className="flex gap-2 my-2">
        <img
          src={imagePrefix + profileSrc}
          alt=""
          className="w-8 h-8 rounded-full border-2 border-slate-300"
        />

        <div className="flex-1">
          <div className="text-slate-600">{email}</div>
          <div className="text-2xl text-slate-800 font-bold secondary-font">
            {title}
          </div>
          <div className="text-slate-600">{content}</div>
          <div className="flex gap-1">
            <div
              className={`like ${
                alreadyLiked ? "liked" : ""
              } my-2 flex items-center border border-slate-60 w-fit px-4 pl-2 py-2 rounded-full group cursor-pointer transition-colors hover:bg-violet-100 hover:border-violet-600`}
              onClick={handleLikeClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="-8 -8 40 40"
                width="24"
                height="24"
                className="fill-slate-600 group-hover:fill-violet-500"
              >
                <path d="M16.99,24H6.99V11H.06L9.86,.88C10.43,.31,11.18,0,11.99,0h0c.8,0,1.56,.31,2.13,.88l9.82,10.12h-6.95v13Z" />
              </svg>
              <span className="text-slate-600 select-none group-hover:text-violet-500">
                {numberOfLikes}
              </span>
            </div>
            <div className="my-2 flex items-center border border-slate-60 w-fit px-4 pl-2 py-2 rounded-full group cursor-pointer transition-colors hover:bg-violet-100 hover:border-violet-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="-8 -8 40 40"
                width="24"
                height="24"
                className="fill-slate-600 group-hover:fill-violet-500"
              >
                <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12h12v-12C24,5.383,18.617,0,12,0Zm-5,13.5c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Zm5,0c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Zm5,0c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
              </svg>

              <span className="text-slate-600 select-none group-hover:text-violet-500 w-[1ch]"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
