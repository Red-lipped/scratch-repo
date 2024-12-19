import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// importing our styling
import "../../public/styles/main.scss";
import App from './App.jsx';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);