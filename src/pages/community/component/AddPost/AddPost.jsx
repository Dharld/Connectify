import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/toast.hook";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../../store/slices/post/post.actions";

const INITIAL_STATE = {
  title: "",
  content: "",
};

const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX;

export default function AddPost() {
  const {
    state: {
      community: { avatarSrc, name, id: communityId },
    },
  } = useLocation();
  const navigate = useNavigate();
  const { id: userId } = useSelector((state) => state.auth.user);
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const { title, content } = credentials;
  const { showSuccess, showError } = useToast();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content) {
      showError("Please fill in all fields");
      return;
    }

    dispatch(createPost({ title, content, userId, communityId })).then(
      (res) => {
        if (res.error) {
          showError(res.error.message);
          return;
        }
        showSuccess("Post created successfully !");
        setCredentials(INITIAL_STATE);
        navigate(-1);
      }
    );
  };
  return (
    <div className="w-full max-w-[500px] mx-auto h-full ">
      <div className="w-fit px-2 py-1 border border-violet-500 flex items-center gap-1  rounded-full group transition-colors cursor-pointer group hover:bg-violet-200">
        <img
          src={imagePrefix + avatarSrc}
          alt=""
          className="w-8 h-8 rounded-full object-cover border-2 border-violet-500 grouop-hover:"
        />
        <span className=" text-violet-800 group-hover:font-bold">{name}</span>
      </div>
      <h3 className="text-4xl font-black text-violet-800">Create A Post</h3>
      <form className="inputs my-4" onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="title">Title</label>
          <input
            type="title"
            name="title"
            id="title"
            placeholder="Title"
            value={credentials.title}
            onChange={handleChange}
          />
        </div>
        <div className="input my-3">
          <label htmlFor="content">Content</label>
          <textarea
            type="content"
            name="content"
            id="content"
            rows={12}
            placeholder="Content"
            value={credentials.content}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="w-full mt-4">
          Create New Post
        </button>
      </form>
    </div>
  );
}
