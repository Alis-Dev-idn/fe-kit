import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Kit Styles
import "@alisdev/fe-kit-ui/dist/index.css";
import "@alisdev/fe-kit-modal/dist/index.css";
import "@alisdev/fe-kit-notify/dist/index.css";
import "@alisdev/fe-kit-confirm/dist/index.css";
import "@alisdev/fe-kit-input/dist/index.css";
import "@alisdev/fe-kit-table/dist/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
