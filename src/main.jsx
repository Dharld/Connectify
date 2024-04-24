import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store/store.jsx";
import { Provider } from "react-redux";
import { ToasterProvider } from "./hooks/toast.hook.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router.jsx";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToasterProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ToasterProvider>
  </React.StrictMode>
);
