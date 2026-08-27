import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const AgentDashboard = lazy(() => import('./pages/AgentDashboard'))
const CaseDetail = lazy(() => import('./pages/CaseDetail'))
const Metrics = lazy(() => import('./pages/Metrics'))

// Loading component
function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-signal-deep">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-accent border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/agent/cases/:id" element={<CaseDetail />} />
        <Route path="/agent/metrics" element={<Metrics />} />
      </Routes>
    </Suspense>
  )
}
