import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getCommunity } from "../../../../store/slices/community/community.actions";
import "./CommunityDetails.scss";
import {
  addAvatarImage,
  addBannerImage,
} from "../../../../services/communityService";
import { useToast } from "../../../../hooks/toast.hook";
import {
  getPostByCommunity,
  getPosts,
} from "../../../../store/slices/post/post.actions";
import Post from "../../../../components/Post/Post";

const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX;

export default function CommunityDetails() {
  const [bannerImg, setBannerImg] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const { name } = useParams();

  console.log(name);

  const { id: userId } = useSelector((state) => state.auth.user);

  const inputFileRef = useRef(null);
  const inputAvatarFileRef = useRef(null);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (bannerFile && name) {
      addBannerImage(name, bannerFile)
        .then(() => {
          showSuccess("Successfully added a new banner image");
        })
        .catch(() => {
          showError("Failed to add a new banner image");
        });
    }
  }, [bannerFile]);

  useEffect(() => {
    if (avatarFile && name) {
      addAvatarImage(name, avatarFile)
        .then(() => {
          showSuccess("Successfully added a new avatar image");
        })
        .catch(() => {
          showError("Failed to add a new avatar image");
        });
    }
  }, [avatarFile]);

  useEffect(() => {
    dispatch(getCommunity({ name })).then((res) => {
      const payload = res.payload;
      const c = {
        id: payload.COMMUNITY_ID,
        avatarSrc: payload.COMMUNITY_AVATAR_SRC,
        bannerSrc: payload.COMMUNITY_BANNER_SRC,
        name: payload.COMMUNITY_NAME,
        adminId: payload.COMMUNITY_ADMIN,
      };
      if (c.adminId === userId) setIsAdmin(true);
      setAvatarImg(imagePrefix + c.avatarSrc);
      setBannerImg(imagePrefix + c.bannerSrc);
      setCommunity(c);
    });
  }, [name]);

  useEffect(() => {
    dispatch(getPostByCommunity({ name })).then((res) => {
      if (res.error) {
        showError(res.error);
        return;
      }
      setPosts(res.payload);
    });
  }, []);

  const handleContainerClick = () => {
    if (inputFileRef.current) inputFileRef.current.click();
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];

    // Read the image
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setBannerImg(reader.result);
      setBannerFile(file);
    };
  };

  const handleContainerAvatarClick = () => {
    inputAvatarFileRef.current.click();
  };

  const handleAvatarChange = () => {
    const file = inputAvatarFileRef.current.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvatarImg(reader.result);
      setAvatarFile(file);
    };
  };

  return (
    <div className="px-4 w-full">
      {community && (
        <>
          <div className="banner bg-slate-200 relative overflow">
            <div className="banner-img rounded-xl overflow-hidden">
              {bannerImg && (
                <>
                  <div className="banner-overlay absolute top-0 left-0 w-full h-full rounded-xl"></div>
                  <img
                    src={bannerImg}
                    alt=""
                    className="absolute w-full h-full top-0 left-0 object-cover rounded-xl"
                  />
                </>
              )}
            </div>
            <div className="banner-content">
              <h1 className="relative banner-title z-10 font-bold">{name}</h1>
              <div className="avatar  bg-slate-100 relative z-10">
                {avatarImg && (
                  <div className="relative rounded-xl overflow-hidden w-full h-full border-4 border-white">
                    <img
                      src={avatarImg}
                      alt=""
                      className="absolute w-full h-full top-0 left-0 object-cover"
                    />
                  </div>
                )}
                {isAdmin && (
                  <div
                    className="position absolute bottom-2 right-2 cursor-pointer w-[48px] h-[48px] grid place-items-center bg-slate-300 rounded-md group hover:bg-violet-400 transition-colors"
                    onClick={handleContainerAvatarClick}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={inputAvatarFileRef}
                      onChange={handleAvatarChange}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      className="fill-slate-500 grid place-items-center group-hover:fill-violet-900"
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                    >
                      <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,21c-4.963,0-9-4.037-9-9S7.037,3,12,3s9,4.037,9,9-4.037,9-9,9Zm3.5-13h-.696l-1.285-2h-3.037l-1.285,2h-.696c-.828,0-1.5.672-1.5,1.5v6.5h10v-6.5c0-.828-.672-1.5-1.5-1.5Zm-3.5,6c-1.105,0-2-.895-2-2s.895-2,2-2,2,.895,2,2-.895,2-2,2Z" />
                    </svg>
                  </div>
                )}
              </div>
              {isAdmin && (
                <div
                  className="position absolute z-30 bottom-2 right-2 cursor-pointer w-[48px] h-[48px] grid place-items-center bg-slate-300 rounded-md group hover:bg-violet-400 transition-colors"
                  onClick={handleContainerClick}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={inputFileRef}
                    onChange={handleBannerChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    className="fill-slate-500 grid place-items-center group-hover:fill-violet-900"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                  >
                    <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,21c-4.963,0-9-4.037-9-9S7.037,3,12,3s9,4.037,9,9-4.037,9-9,9Zm3.5-13h-.696l-1.285-2h-3.037l-1.285,2h-.696c-.828,0-1.5.672-1.5,1.5v6.5h10v-6.5c0-.828-.672-1.5-1.5-1.5Zm-3.5,6c-1.105,0-2-.895-2-2s.895-2,2-2,2,.895,2,2-.895,2-2,2Z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="my-20">
            <button>
              <Link to="posts/create" state={{ community }}>
                Create Post
              </Link>
            </button>
            <div className="posts">
              {posts.length === 0 ? (
                <div className="empty-state">No posts Yet 😅</div>
              ) : (
                <div className="post-container">
                  {posts.map((post) => (
                    <Post post={post} key={post.POST_ID} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
