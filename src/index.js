import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import { ReactQuizProvider } from "./context/ReactQuizContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReactQuizProvider>
      <App />
    </ReactQuizProvider>
  </React.StrictMode>
);
