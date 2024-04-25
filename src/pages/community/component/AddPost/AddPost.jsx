import { useState } from "react";
import { useLocation } from "react-router-dom";

const INITIAL_STATE = {
  title: "",
  content: "",
};

export default function AddPost() {
  const {
    state: {
      community: { avatarSrc, name },
    },
  } = useLocation();
  console.lo;
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const { title, content } = credentials;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(location);
  };
  return (
    <div className="w-full max-w-[500px] mx-auto h-full ">
      <div className="border border-violet-900">
        <img src={avatarSrc} alt="" />
        <span>{name}</span>
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
            name="title"
            id="title"
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
