import { useEffect, useState, memo } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CaseDetail {
  id: string
  candidate: any
  decision: any
  status: string
  actionLog: Array<{
    id: string
    timestamp: string
    action: string
    actor: string
    metadata: any
  }>
  context: any
  createdAt: string
  updatedAt: string
}

export default function CaseDetail() {
  const { id } = useParams()
  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCase()
  }, [id])

  const fetchCase = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3001/api/cases/${id}`)
      const data = await response.json()
      setCaseData(data)
    } catch (error) {
      console.error('Error fetching case:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-signal-deep">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-accent border-t-transparent" />
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="flex h-screen items-center justify-center bg-signal-deep">
        <p className="text-signal-muted">Case not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-signal-deep">
      {/* Header */}
      <div className="border-b border-white/10 bg-signal-surface/50 px-6 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-signal-text">
                Case #{caseData.id.slice(0, 8)}
              </h1>
              <p className="mt-1 text-sm text-signal-muted">
                {caseData.candidate.name} · {caseData.candidate.position}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/agent')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Info */}
            <Card className="border-white/10 bg-signal-surface/40 p-6">
              <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-signal-text">
                Candidate Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-signal-muted">Name</span>
                  <span className="text-sm font-medium text-signal-text">
                    {caseData.candidate.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-signal-muted">Position</span>
                  <span className="text-sm font-medium text-signal-text">
                    {caseData.candidate.position}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-signal-muted">Stage</span>
                  <Badge>{caseData.candidate.stage}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-signal-muted">Days Inactive</span>
                  <span className="text-sm font-medium text-signal-text">
                    {caseData.candidate.daysInactive} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-signal-muted">SLA Status</span>
                  <Badge
                    className={
                      caseData.candidate.slaBreached
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }
                  >
                    {caseData.candidate.slaBreached ? 'Breached' : 'OK'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Signals Detected */}
            <Card className="border-white/10 bg-signal-surface/40 p-6">
              <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-signal-text">
                Signals Detected
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-signal-accent">•</span>
                  <span className="text-signal-muted">
                    {caseData.candidate.feedback.submitted}/
                    {caseData.candidate.feedback.required} interviewer feedback submitted
                  </span>
                </li>
                {caseData.candidate.candidateFollowUps > 0 && (
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-signal-accent">•</span>
                    <span className="text-signal-muted">
                      Candidate followed up {caseData.candidate.candidateFollowUps}{' '}
                      {caseData.candidate.candidateFollowUps === 1 ? 'time' : 'times'}
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-signal-accent">•</span>
                  <span className="text-signal-muted">
                    Hiring manager{' '}
                    {caseData.candidate.hiringManagerActive ? 'active' : 'inactive'}
                  </span>
                </li>
              </ul>
            </Card>

            {/* Agent Decision */}
            <Card className="border-signal-accent/30 bg-signal-accent/5 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-signal-text">
                  Agent Decision
                </h2>
                <Badge className="bg-signal-accent/20 text-signal-accent">
                  {caseData.decision.type.toUpperCase()}
                </Badge>
              </div>

              <blockquote className="border-l-2 border-signal-accent pl-4 text-signal-text italic">
                {caseData.decision.reason}
              </blockquote>

              <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-signal-muted">
                  Actions Planned
                </h3>
                <ol className="space-y-2">
                  {caseData.decision.actions.map((action: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-signal-accent/20 text-xs font-semibold text-signal-accent">
                        {i + 1}
                      </span>
                      <span className="text-signal-text">{action}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-signal-deep/50 p-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-signal-muted">
                    Confidence
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-signal-text">
                    {caseData.decision.confidence}%
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-signal-muted">
                    Approval
                  </div>
                  <div className="mt-1 text-sm font-semibold text-signal-text">
                    {caseData.decision.requiresApproval ? 'Required' : 'Not Required'}
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Log */}
            <Card className="border-white/10 bg-signal-surface/40 p-6">
              <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-signal-text">
                Action Log
              </h2>
              <div className="space-y-4">
                {caseData.actionLog.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex gap-4 border-l-2 border-signal-accent/30 pl-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-signal-text">
                          {log.action}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.actor}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-signal-muted">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Context */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-signal-surface/40 p-6">
              <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-signal-text">
                Context
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-signal-muted">Urgency Score</span>
                  <div className="mt-2">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-signal-text font-semibold">
                        {caseData.context?.urgency || 0}
                      </span>
                      <span className="text-signal-muted">/ 100</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-signal-deep">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
                        style={{ width: `${caseData.context?.urgency || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-6">
              <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-signal-text">
                Policies Checked
              </h2>
              <ul className="space-y-2">
                {caseData.decision.policiesChecked?.map((policy: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-green-400">✓</span>
                    <span className="text-signal-muted">{policy}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
