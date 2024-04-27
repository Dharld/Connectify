import { useState, useRef } from "react";
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
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);

  const { title, content } = credentials;
  const { showSuccess, showError } = useToast();
  const inputFileRef = useRef();

  const dispatch = useDispatch();

  const handleImageChange = () => {
    const file = inputFileRef.current.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFile(file);
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleClick = () => {
    inputFileRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content) {
      showError("Please fill in all fields");
      return;
    }

    dispatch(createPost({ title, content, userId, communityId, file })).then(
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
    <div className="w-full h-full px-4 flex gap-4">
      <div className="left max-w-[500px]  flex-1">
        <div className="w-fit px-2 py-1 border border-violet-500 flex items-center gap-1  rounded-full group transition-colors cursor-pointer group hover:bg-violet-200">
          <img
            src={imagePrefix + avatarSrc}
            alt=""
            className="w-8 h-8 rounded-full object-cover border-2 border-violet-500 grouop-hover:"
          />
          <span className=" text-violet-800 group-hover:font-bold">{name}</span>
        </div>
        <h3 className="mt-4 text-4xl font-bold text-violet-800 secondary-font">
          Create A Post
        </h3>
        <form className="inputs my-4" onSubmit={handleSubmit}>
          <div className="flex">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 -8 40 40"
                width="40"
                height="40"
                className="fill-slate-400 hover:fill-violet-500 cursor-pointer"
                onClick={handleClick}
              >
                <path d="m16,7c0,1.105-.895,2-2,2s-2-.895-2-2,.895-2,2-2,2,.895,2,2Zm6.5,11h-1.5v-1.5c0-.828-.671-1.5-1.5-1.5s-1.5.672-1.5,1.5v1.5h-1.5c-.829,0-1.5.672-1.5,1.5s.671,1.5,1.5,1.5h1.5v1.5c0,.828.671,1.5,1.5,1.5s1.5-.672,1.5-1.5v-1.5h1.5c.829,0,1.5-.672,1.5-1.5s-.671-1.5-1.5-1.5Zm-6.5-3l-4.923-4.923c-1.423-1.423-3.731-1.423-5.154,0l-2.923,2.923v-7.5c0-1.379,1.122-2.5,2.5-2.5h10c1.378,0,2.5,1.121,2.5,2.5v6c0,.828.671,1.5,1.5,1.5s1.5-.672,1.5-1.5v-6c0-3.032-2.467-5.5-5.5-5.5H5.5C2.467,0,0,2.468,0,5.5v10c0,3.032,2.467,5.5,5.5,5.5h6c.829,0,1.5-.672,1.5-1.5v-.5c0-1.657,1.343-3,3-3v-1Z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 -8 40 40"
                width="40"
                height="40"
                className="fill-slate-400 hover:fill-violet-500 cursor-pointer"
                onClick={() => setImagePreview(null)}
              >
                <path d="m22,4h-4.101c-.465-2.279-2.484-4-4.899-4h-2c-2.414,0-4.434,1.721-4.899,4H2c-.552,0-1,.447-1,1s.448,1,1,1h.86l1.296,13.479c.248,2.578,2.388,4.521,4.977,4.521h5.727c2.593,0,4.733-1.947,4.978-4.528l1.276-13.472h.885c.552,0,1-.447,1-1s-.448-1-1-1Zm-11-2h2c1.302,0,2.402.839,2.816,2h-7.631c.414-1.161,1.514-2,2.816-2Zm4.707,14.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414l-2.293,2.293,2.293,2.293Z" />
              </svg>
            </div>
          </div>

          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={inputFileRef}
            onChange={handleImageChange}
          />
          <div className="input">
            <label htmlFor="title">Title</label>
            <input
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
              name="content"
              id="content"
              rows={6}
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
      <div className="right">
        {imagePreview ? (
          <>
            <h3 className="mb-4 text-4xl font-bold text-violet-800 secondary-font">
              Image Preview
            </h3>
            {file && file.type.startsWith("image") ? (
              <img
                src={imagePreview}
                alt=""
                className="w-full max-w-96 max-h-96 object-cover rounded-sm"
              />
            ) : (
              <video
                src={imagePreview}
                controls
                className="w-full max-w-96 max-h-96 object-cover rounded-sm"
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
