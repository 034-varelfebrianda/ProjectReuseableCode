import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="p-5">
      <App />
    </div>
  </StrictMode>
);