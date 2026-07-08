import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="p-5 min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300">
        <App />
      </div>
    </ThemeProvider>
  </StrictMode>
);