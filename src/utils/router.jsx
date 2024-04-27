import { createBrowserRouter } from "react-router-dom";
import Signup from "../pages/signup/Signup.jsx";
import Login from "../pages/login/Login.jsx";
import Home from "../pages/home/Home.jsx";
import App from "../App.jsx";
import AddCommunity from "../pages/home/component/AddCommunity/AddCommunity.jsx";
import Community from "../pages/community/Community.jsx";
import CommunityDetails from "../pages/community/component/CommunityDetails/CommunityDetails.jsx";
import AddPost from "../pages/community/component/AddPost/AddPost.jsx";
import PostDetails from "../components/PostDetails/PostDetails.jsx";
import Feed from "../components/Feed/Feed.jsx";
import FeedHome from "../components/FeedHome/FeedHome.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
        children: [
          {
            path: "",
            element: <Feed />,
            children: [
              {
                path: "",
                element: <FeedHome />,
              },
              {
                path: "communities",
                element: <Community />,
                children: [
                  {
                    path: ":name",
                    element: <CommunityDetails />,
                  },
                  {
                    path: ":name/posts/:postId",
                    element: <PostDetails />,
                  },
                  {
                    path: ":name/posts/create",
                    element: <AddPost />,
                  },
                  {
                    path: "create",
                    element: <AddCommunity />,
                  },
                ],
              },
              {
                path: "posts/:postId",
                element: <PostDetails />,
              },
            ],
          },
        ],
      },

      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
