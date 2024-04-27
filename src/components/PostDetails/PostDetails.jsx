import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "./../../hooks/toast.hook";
import "./PostDetails.scss";
import postService from "../../services/postService";
import stringUtils from "../../utils/stringUtils";
import { useDispatch, useSelector } from "react-redux";
import dateUtils from "../../utils/dateUtils";
import {
  commentPost,
  likePost,
  unlikePost,
} from "../../store/slices/post/post.actions";
import paperPlaneIcon from "./../../assets/icons/paper-plane.png";

const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX;

export default function PostDetails() {
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(-1);
  const [showAll, setShowAll] = useState(false);
  const [formattedCreatedAt, setFormatedCreatedAt] = useState(null);
  const [postAuthor, setPostAuthor] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [textComment, setTextComment] = useState("");
  const [comments, setComments] = useState([]);
  const { name } = useParams();

  console.log(name);

  const dispatch = useDispatch();

  const { postId } = useParams();

  const currentUser = useSelector((state) => state.auth.user);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    setLoading(true);
    postService.getPostById(postId).then((post) => {
      const newPost = {
        id: post.POST_ID,
        title: post.POST_TITLE,
        content: post.POST_CONTENT,
        image: post.POST_IMAGE_SRC,
        user: post.User,
        likes: post.Upvote,
        comments: post.Comment.map((c) => {
          const author = c.User;
          return {
            id: c.COMMENT_ID,
            content: c.COMMENT_TEXT,
            createdAt: c.COMMENT_CREATED_AT,
            user: {
              email: author.USER_EMAIL,
              avatar: author.USER_PROFILE_SRC,
            },
          };
        }),
      };

      const liked = newPost.likes.some((l) => l.USER_ID === currentUser.id);

      const author = {
        email: newPost.user.USER_EMAIL,
        avatar: newPost.user.USER_PROFILE_SRC,
      };

      setPostAuthor(author);

      setNumberOfLikes(newPost.likes.length);
      setAlreadyLiked(liked);
      setPost(newPost);
      setFormatedCreatedAt(dateUtils.formatToNow(post.POST_CREATED_AT));
      const postComments = newPost.comments.sort(
        (c1, c2) => new Date(c2.createdAt) - new Date(c1.createdAt)
      );
      setComments(postComments);
      setLoading(false);
    });
  }, [postId]);

  const handleShow = (event) => {
    console.log(event);
    setShowAll(!showAll);
    event.stopPropagation();
  };

  const handleLikeClick = (event) => {
    if (alreadyLiked) {
      dispatch(unlikePost({ userId: currentUser.id, postId }));
      setNumberOfLikes(numberOfLikes > 0 ? numberOfLikes - 1 : numberOfLikes);
    } else {
      dispatch(likePost({ userId: currentUser.id, postId }));
      setNumberOfLikes(numberOfLikes + 1);
    }
    setAlreadyLiked(!alreadyLiked);
    event.stopPropagation();
  };

  const handlePost = () => {
    if (!textComment) {
      showError("You can't submit an empty comment");
      return;
    }
    dispatch(
      commentPost({ userId: currentUser.id, postId, content: textComment })
    ).then((res) => {
      if (res.error) {
        showError(res.error.message);
        return;
      }
      const newComment = {
        content: textComment,
        createdAt: new Date(),
        user: {
          email: currentUser.email,
          avatar: currentUser.profileImg,
        },
      };
      const newComments = comments.slice();
      newComments.unshift(newComment);
      setComments(newComments);
      setTextComment("");
    });
  };

  function isVideo(url) {
    const videoExtensions = [
      "3g2",
      "3gp",
      "aaf",
      "asf",
      "avchd",
      "avi",
      "drc",
      "flv",
      "m2v",
      "m4p",
      "m4v",
      "mkv",
      "mng",
      "mov",
      "mp2",
      "mp4",
      "mpe",
      "mpeg",
      "mpg",
      "mpv",
      "mxf",
      "nsv",
      "ogg",
      "ogv",
      "qt",
      "rm",
      "rmvb",
      "roq",
      "svi",
      "vob",
      "webm",
      "wmv",
      "yuv",
    ];
    const urlExtension = url.split(".").pop();
    return videoExtensions.includes(urlExtension);
  }

  if (loading) {
    return (
      <div className="px-4 w-full h-full grid place-items-center -mt-6">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <section className="post-details px-4 w-full max-w-[800px] mx-auto">
      <div className="border-b-2 border-b-slate-100 w-full px-4 py-4 rounded-md cursor-pointer  transition-colors">
        <div className="text-sm text-slate-500">
          {stringUtils.capitalize(formattedCreatedAt)}
        </div>
        <div className="flex gap-2 my-2">
          <img
            src={imagePrefix + postAuthor.avatar}
            alt=""
            className="w-8 h-8 rounded-full border-2 border-slate-300 object-cover"
          />

          <div className="flex-1">
            <div className="text-slate-600">{postAuthor.email}</div>
            <div className="text-2xl text-slate-800 font-bold secondary-font">
              {post.title}
            </div>

            <div className="w-full bg-slate-50 my-2">
              {isVideo(post.image) ? (
                <video
                  src={imagePrefix + post.image}
                  controls
                  className="w-full"
                ></video>
              ) : (
                <img src={imagePrefix + post.image} alt="" className="w-full" />
              )}
            </div>
            <div className="text-slate-600">
              {
                <span>
                  {showAll ? post.content : post.content.slice(0, 200) + "..."}{" "}
                  {post.content.length > 100 && (
                    <span className="text-violet-500 cursor-pointer">
                      <span onClick={handleShow}>
                        {showAll ? "Show less" : "Show more"}
                      </span>
                    </span>
                  )}
                </span>
              }
            </div>
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
      <div className="mt-4">
        <div className="input row">
          <input
            name="title"
            id="title"
            placeholder="Add your comment"
            className="flex-1"
            value={textComment}
            onChange={(e) => {
              setTextComment(e.target.value);
            }}
          />
          <button onClick={handlePost}>
            <div className="button-wrapper flex items-center gap-1">
              <span>Send</span>
              <img
                className="w-4 h-4 object-cover"
                src={paperPlaneIcon}
                alt=""
              />
            </div>
          </button>
        </div>
      </div>
      {/* Comments */}
      <div className="comments mt-4">
        {comments.length === 0 ? (
          <div className="text-md text-slate-500 text-c">
            There's no comment yet
          </div>
        ) : (
          comments.map((comment) => (
            <div
              className="comment py-4 rounded-sm flex gap-1"
              key={comment.id}
            >
              <img
                src={imagePrefix + comment.user.avatar}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-slate-300 object-cover"
              />
              <div className="content">
                <div className="flex text-slate-500 items-center">
                  <div>{comment.user.email}</div>
                  <div className="w-1 h-1 mx-2 rounded-full bg-slate-500"></div>
                  <div>
                    {stringUtils.capitalize(
                      dateUtils.formatToNow(comment.createdAt)
                    )}
                  </div>
                </div>
                <div className="text-slate-600">{comment.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
