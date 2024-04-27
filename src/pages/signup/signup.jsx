import { useState } from "react";
import "./Signup.scss";
import { useToast } from "../../hooks/toast.hook";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../store/slices/auth/auth.actions";
import { useNavigate } from "react-router-dom";

const INITIAL_STATE = {
  email: "",
  password: "",
  confirmPassword: "",
  birthDate: "",
};

export default function Signup() {
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { showError, showSuccess } = useToast();

  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // If you want to preview the image immediately after selecting it
    const reader = new FileReader();
    reader.onload = function () {
      setImgPreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = credentials;
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    dispatch(signup({ credentials, selectedFile }))
      .then((res) => {
        if (res.error) {
          showError(res.error.message);
          return;
        }
        showSuccess("Account created successfully");
        setCredentials(INITIAL_STATE);
        setSelectedFile(null);
        setImgPreview(null);
        navigate("/login");
      })
      .catch((err) => showError(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-[100vh] w-full grid place-items-center"
    >
      <div className="wrapper max-w-[500px] w-full mx-auto">
        <h1 className="secondary-font font-bold text-2xl">Signup</h1>
        <div className="input-profile-pic my-4">
          <div>Profile Picture</div>
          {imgPreview && (
            <div className="flex gap-1 items-end my-2">
              <img
                src={imgPreview}
                alt="Preview"
                className="max-w-[150px] max-h-[150px] object-cover rounded-md"
              />
              <button
                className="h-fit"
                onClick={() => {
                  setImgPreview(null);
                  setSelectedFile(null);
                }}
              >
                Remove profile Picture
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            onChange={handleFileChange}
            value={selectedFile ? selectedFile.filename : ""}
            className="w-full"
          />
        </div>
        <div className="input my-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <div className="input my-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div className="input my-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={credentials.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div className="input">
          <label htmlFor="birthdate">Birthdate</label>
          <input
            type="date"
            name="birthDate"
            value={credentials.birthDate}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="my-10 w-full flex justify-center items-center gap-1"
        >
          {loading ? (
            <div className="spinner spinner-extra-small"></div>
          ) : (
            <div>Signup</div>
          )}
        </button>
      </div>
    </form>
  );
}
