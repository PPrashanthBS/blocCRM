import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LeadAssignmentPage } from '@/pages/LeadAssignmentPage'
import { LeadsPage } from '@/pages/LeadsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SalesCallersPage } from '@/pages/SalesCallersPage'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/leads" replace />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/sales-callers" element={<SalesCallersPage />} />
        <Route path="/lead-assignment" element={<LeadAssignmentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  )
}

export default App
