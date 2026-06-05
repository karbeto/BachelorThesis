import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast' 

import LoginPage from './pages/Login/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ReportsPage from './pages/Reports/ReportsPage'
import ReportDetailPage from './pages/ReportDetail/ReportDetailPage'
import IdeasPage from './pages/Ideas/IdeasPage'
import IdeaDetailPage from './pages/IdeaDetail/IdeaDetailPage'
import AdminPage from './pages/Admin/AdminPage'
import Layout from './components/Layout'

const queryClient = new QueryClient()

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/:id" element={<ReportDetailPage />} />
            <Route path="ideas" element={<IdeasPage />} />
            <Route path="/ideas/:id" element={<IdeaDetailPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}