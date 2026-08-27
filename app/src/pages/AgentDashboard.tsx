import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Case {
  id: string
  candidate: {
    name: string
    position: string
    stage: string
    daysInactive: number
    slaBreached: boolean
  }
  decision: {
    type: 'act' | 'ask' | 'escalate' | 'wait'
    reason: string
    confidence: number
  }
  status: 'pending' | 'resolved' | 'escalated' | 'waiting'
  updatedAt: string
}

interface Summary {
  resolved: number
  escalated: number
  waiting: number
  pending: number
}

export default function AgentDashboard() {
  const [cases, setCases] = useState<Case[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchCases()
  }, [filter])

  const fetchCases = async () => {
    try {
      setLoading(true)
      const query = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`http://localhost:3001/api/cases${query}`)
      const data = await response.json()
      setCases(data.cases)
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'escalated':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'waiting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-signal-muted/20 text-signal-muted'
    }
  }

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'act':
        return '⚡'
      case 'escalate':
        return '🚨'
      case 'ask':
        return '❓'
      case 'wait':
        return '⏸️'
      default:
        return '•'
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-signal-deep">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-signal-deep">
      {/* Header */}
      <div className="border-b border-white/10 bg-signal-surface/50 px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-signal-text">
                Signal Agent
              </h1>
              <p className="mt-1 text-sm text-signal-muted">
                AI Recruiting Operations Dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = '/')}
              >
                Back to Home
              </Button>
              <Button
                size="sm"
                onClick={() => (window.location.href = '/agent/metrics')}
              >
                View Metrics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card className="border-green-500/30 bg-green-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-400">
                    Resolved
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-signal-text">
                    {summary.resolved}
                  </p>
                </div>
                <div className="text-4xl">🟢</div>
              </div>
            </Card>

            <Card className="border-yellow-500/30 bg-yellow-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                    Waiting
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-signal-text">
                    {summary.waiting}
                  </p>
                </div>
                <div className="text-4xl">🟡</div>
              </div>
            </Card>

            <Card className="border-red-500/30 bg-red-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-400">
                    Escalated
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-signal-text">
                    {summary.escalated}
                  </p>
                </div>
                <div className="text-4xl">🔴</div>
              </div>
            </Card>

            <Card className="border-blue-500/30 bg-blue-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                    Pending
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-signal-text">
                    {summary.pending}
                  </p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Cases
          </Button>
          <Button
            variant={filter === 'resolved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </Button>
          <Button
            variant={filter === 'waiting' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('waiting')}
          >
            Waiting
          </Button>
          <Button
            variant={filter === 'escalated' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('escalated')}
          >
            Escalated
          </Button>
        </div>

        {/* Cases Grid */}
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="cursor-pointer border-white/10 bg-signal-surface/40 p-5 transition-all hover:border-signal-accent/50 hover:bg-signal-surface/60"
              onClick={() =>
                (window.location.href = `/agent/cases/${caseItem.id}`)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-signal-text">
                      {caseItem.candidate.name}
                    </h3>
                    <Badge className={getStatusColor(caseItem.status)}>
                      {caseItem.status}
                    </Badge>
                    {caseItem.candidate.slaBreached && (
                      <Badge className="bg-red-500/20 text-red-400">
                        SLA Breach
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-sm text-signal-muted">
                    <span>{caseItem.candidate.position}</span>
                    <span>•</span>
                    <span>{caseItem.candidate.stage}</span>
                    <span>•</span>
                    <span>{caseItem.candidate.daysInactive}d inactive</span>
                  </div>

                  <div className="mt-4 flex items-start gap-2">
                    <span className="text-2xl">
                      {getDecisionIcon(caseItem.decision.type)}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-signal-accent">
                        Agent Decision: {caseItem.decision.type.toUpperCase()}
                      </p>
                      <p className="mt-1 text-sm text-signal-text">
                        {caseItem.decision.reason}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-signal-muted">
                    Confidence
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-signal-accent">
                    {caseItem.decision.confidence}%
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {cases.length === 0 && (
          <Card className="border-white/10 bg-signal-surface/40 p-12 text-center">
            <p className="text-signal-muted">No cases found.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
