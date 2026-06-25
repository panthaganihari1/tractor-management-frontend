import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout'
import Dashboard from './pages/Dashboard'
import TractorPage from './pages/TractorPage'
import NagaliPage from './pages/NagaliPage'
import FarmerPage from './pages/FarmerPage'
import FinancePage from './pages/FinancePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tractor" element={<TractorPage />} />
          <Route path="nagali" element={<NagaliPage />} />
          <Route path="farmers" element={<FarmerPage />} />
          <Route path="finance" element={<FinancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
