import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getPostsByTitle } from "../../store/slices/post/post.actions";

export default function Sidebar() {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const handleChange = function (e) {
    const value = e.target.value;
    setSearchText(value);
    dispatch(getPostsByTitle({ title: value }));
  };

  return (
    <div className="sidebar flex flex-col p-4 w-full max-w-[350px] border-r border-slate-200 h-full">
      <div className="searchbar flex  bg-slate-100 rounded-md  items-center px-2 focus-within:ring-violet-200 ring ring-transparent mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Outline"
          viewBox="-8 -8 40 40"
          width="32"
          height="32"
          className="flex-shrink-0"
        >
          <path
            className="fill-violet-700"
            d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"
          />
        </svg>
        <input
          type="text"
          className="flex-1 bg-transparent outline-none border-transparent pl-0 ring-0 focus:ring-0"
          placeholder="Search..."
          onChange={handleChange}
          value={searchText}
        />
      </div>
      <div className="sidebar-body  flex-1">
        <nav>
          <ul>
            <li>
              <Link to="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="-8 -8 40 40"
                  width="32"
                  height="32"
                >
                  <path
                    className="fill-violet-700"
                    d="M18.5,24H5.5c-3.032,0-5.5-2.468-5.5-5.5V9.886c0-1.83,.906-3.534,2.424-4.559L8.924,.941c1.867-1.262,4.284-1.262,6.153,0l6.499,4.386c1.518,1.024,2.424,2.729,2.424,4.559v8.614c0,3.032-2.468,5.5-5.5,5.5ZM12,2.997c-.486,0-.974,.144-1.397,.431L4.102,7.813c-.689,.466-1.102,1.24-1.102,2.072v8.614c0,1.379,1.121,2.5,2.5,2.5h13c1.379,0,2.5-1.121,2.5-2.5V9.886c0-.832-.412-1.606-1.102-2.072L13.398,3.428c-.425-.287-.912-.431-1.398-.431Z"
                  />
                </svg>
                <span className="text-md secondary-font font-bold">Home</span>
              </Link>
            </li>
            {/* <li>
              <Link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Outline"
                  viewBox="-8 -8 40 40"
                  width="40"
                  height="40"
                  className="fill-violet-700"
                >
                  <path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z" />
                  <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z" />
                </svg>

                <span className="text-md secondary-font font-bold">
                  My Posts
                </span>
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
      <button className="w-full">Create Community</button>
    </div>
  );
}
