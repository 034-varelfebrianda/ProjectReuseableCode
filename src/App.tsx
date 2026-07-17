import LargeDataTable from './pages/LargeDataTable'
import Jobvacation from './pages/Jobvacation'
import "./styles/index.css"

export default function App() {
  return (
    <div className="app-root-container">
      <div className="page-section">
        <LargeDataTable />
      </div>
      <div className="page-section">
        <Jobvacation />
      </div>
    </div>
  )
}
