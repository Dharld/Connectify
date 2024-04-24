import { useState } from "react";
import { useToast } from "../../../../hooks/toast.hook";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCommunity } from "../../../../store/slices/community/community.actions";

export default function AddCommunity() {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const { showError, showSuccess } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!name) {
      showError("Please enter a community name");
      return;
    }
    dispatch(createCommunity({ name, adminId: user.id })).then((res) => {});
    showSuccess("Community created successfully !");
  };

  const handleChange = function (e) {
    setName(e.target.value);
  };

  return (
    <div className="fixed w-full h-full overflow-hidden grid place-items-center">
      <div className="fixed w-full h-full overlay"></div>
      <form
        onSubmit={handleSubmit}
        className="relative p-4 max-w-[500px] w-full rounded-lg bg-white z-10"
      >
        <h2 className="text-violet-700 text-xl font-bold">Add a Community</h2>
        <div className="input">
          <label htmlFor="email">Name</label>
          <input
            type="name"
            name="name"
            id="name"
            value={name}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="w-full mt-4">
          Create Community
        </button>
      </form>
    </div>
  );
}
