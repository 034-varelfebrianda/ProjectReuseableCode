import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LargeDataTable from "../components/organism/LargeDataTable";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <main className="min-h-screen bg-[#f7f7f8] px-6 py-6">
        <LargeDataTable />
      </main>
  </StrictMode>
);