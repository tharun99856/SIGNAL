import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Metrics {
  operational: {
    slaBreachesPrevented: number
    candidateGhostingRate: number
    medianResponseTime: number
    casesResolvedAutonomously: number
    casesResolvedAutonomouslyPercent: string
    humanInterventionsRequired: number
    humanInterventionsPercent: string
    overrideRate: string
  }
  agentQuality: {
    correctEscalationRate: number
    incorrectAutonomousActions: number
    policyViolations: number
    humanOverrideFrequency: number
    averageConfidence: number
  }
  timeline: {
    last7Days: Array<{
      date: string
      casesHandled: number
      autonomous: number
      escalated: number
      overridden: number
    }>
  }
  byDecisionType: {
    act: number
    escalate: number
    ask: number
    wait: number
  }
  byAutonomyLevel: {
    autonomous: number
    supervised: number
    recommend: number
    observe: number
  }
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !metrics) {
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
                Evaluation & Metrics
              </h1>
              <p className="mt-1 text-sm text-signal-muted">
                Measuring agent performance and operational impact
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Key Insight */}
        <Card className="mb-8 border-signal-accent/30 bg-signal-accent/5 p-6">
          <p className="text-lg italic text-signal-text">
            "I wouldn't measure the agent by whether its responses sound intelligent. I'd
            measure whether it makes correct operational decisions and knows when not to
            act."
          </p>
        </Card>

        {/* Operational Metrics */}
        <div className="mb-8">
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide text-signal-text">
            Operational Metrics
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                SLA Breaches Prevented
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-signal-text">
                {metrics.operational.slaBreachesPrevented}
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Candidate Ghosting Rate
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-green-400">
                {metrics.operational.candidateGhostingRate}%
              </div>
              <div className="mt-1 text-xs text-signal-muted">↓ from 18.5%</div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Median Response Time
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-signal-text">
                {metrics.operational.medianResponseTime}m
              </div>
              <div className="mt-1 text-xs text-signal-muted">minutes</div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Cases Resolved Autonomously
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-signal-accent">
                {metrics.operational.casesResolvedAutonomouslyPercent}%
              </div>
              <div className="mt-1 text-xs text-signal-muted">
                {metrics.operational.casesResolvedAutonomously} cases
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Human Interventions Required
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-signal-text">
                {metrics.operational.humanInterventionsRequired}
              </div>
              <div className="mt-1 text-xs text-signal-muted">
                {metrics.operational.humanInterventionsPercent}% of cases
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Override Rate
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-yellow-400">
                {metrics.operational.overrideRate}%
              </div>
            </Card>
          </div>
        </div>

        {/* Agent Quality Metrics */}
        <div className="mb-8">
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide text-signal-text">
            Agent Quality Metrics
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Correct Escalation Rate
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-green-400">
                {metrics.agentQuality.correctEscalationRate}%
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Incorrect Autonomous Actions
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-signal-text">
                {metrics.agentQuality.incorrectAutonomousActions}
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Policy Violations
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-green-400">
                {metrics.agentQuality.policyViolations}
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                Average Confidence
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-signal-accent">
                {metrics.agentQuality.averageConfidence}%
              </div>
            </Card>
          </div>
        </div>

        {/* Decision Type Breakdown */}
        <div className="mb-8">
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide text-signal-text">
            Decisions by Type
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                    Act
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold text-signal-text">
                    {metrics.byDecisionType.act}
                  </div>
                </div>
                <div className="text-4xl">⚡</div>
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                    Escalate
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold text-signal-text">
                    {metrics.byDecisionType.escalate}
                  </div>
                </div>
                <div className="text-4xl">🚨</div>
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                    Ask
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold text-signal-text">
                    {metrics.byDecisionType.ask}
                  </div>
                </div>
                <div className="text-4xl">❓</div>
              </div>
            </Card>

            <Card className="border-white/10 bg-signal-surface/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-signal-muted">
                    Wait
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold text-signal-text">
                    {metrics.byDecisionType.wait}
                  </div>
                </div>
                <div className="text-4xl">⏸️</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide text-signal-text">
            Last 7 Days Activity
          </h2>
          <Card className="border-white/10 bg-signal-surface/40 p-6">
            <div className="space-y-3">
              {metrics.timeline.last7Days.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-xs text-signal-muted">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex h-8 items-center gap-1 overflow-hidden rounded">
                      <div
                        className="h-full bg-green-500/40"
                        style={{
                          width: `${(day.autonomous / day.casesHandled) * 100}%`,
                        }}
                        title={`${day.autonomous} autonomous`}
                      />
                      <div
                        className="h-full bg-red-500/40"
                        style={{
                          width: `${(day.escalated / day.casesHandled) * 100}%`,
                        }}
                        title={`${day.escalated} escalated`}
                      />
                      <div
                        className="h-full bg-yellow-500/40"
                        style={{
                          width: `${(day.overridden / day.casesHandled) * 100}%`,
                        }}
                        title={`${day.overridden} overridden`}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-signal-text">
                    {day.casesHandled}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-500/40" />
                <span className="text-signal-muted">Autonomous</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-red-500/40" />
                <span className="text-signal-muted">Escalated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-yellow-500/40" />
                <span className="text-signal-muted">Overridden</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
