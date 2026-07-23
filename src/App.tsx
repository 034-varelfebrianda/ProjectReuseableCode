import LargeDataTable from "./pages/LargeDataTable";
import Jobvacation from "./pages/Jobvacation";
import "./styles/index.css";
import ThemeButton from "./features/tables/components/molecules/ThemeButton";
export default function App() {
  return (
    <div className="app-root-container">
      <div className="theme-button">
        <ThemeButton showThemeToggle />
      </div>
      <LargeDataTable />
      <Jobvacation />
    </div>
  );
}
