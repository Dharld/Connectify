import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { store } from "./store/store.jsx";
import { Provider } from "react-redux";
import { ToasterProvider } from "./hooks/toast.hook.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToasterProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ToasterProvider>
  </React.StrictMode>
);
