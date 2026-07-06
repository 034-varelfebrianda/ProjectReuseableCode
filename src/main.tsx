import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./pages/App";
import "./pages/index.css";
import LargeDataTable from "./features/tables/components/organism/LargeDataTable";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="p-5">
      <LargeDataTable />
      {/* <App /> */}
    </div>
  </StrictMode>
);