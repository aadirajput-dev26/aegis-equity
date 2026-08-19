"use client"

import { useEffect, useState } from "react"
import { Check, Clock, ShieldCheck } from "lucide-react"
import type { KYC, KYCSection } from "@/lib/types"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { formatDateTime } from "@/lib/utils"

const STATUS_CONFIG = {
  verified: { icon: Check, color: "var(--success)", bg: "var(--success-bg)", label: "Verified" },
  "pending-review": { icon: Clock, color: "var(--warning)", bg: "var(--warning-bg)", label: "Pending Review" },
  "in-progress": { icon: Clock, color: "var(--primary)", bg: "var(--blue-tint)", label: "In Progress" },
  "not-started": { icon: Clock, color: "var(--text-muted)", bg: "rgba(0,0,0,0.04)", label: "Not Started" },
  rejected: { icon: Clock, color: "var(--danger)", bg: "var(--danger-bg)", label: "Rejected" },
}

function KYCSectionCard({ section }: { section: KYCSection }) {
  const cfg = STATUS_CONFIG[section.status]
  const Icon = cfg.icon
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} style={{ color: cfg.color }} aria-hidden="true" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{section.label}</div>
          <span style={{ padding: "2px 10px", borderRadius: 99, background: cfg.bg, color: cfg.color, fontSize: "0.75rem", fontWeight: 600 }}>
            {cfg.label}
          </span>
        </div>
        {section.details && <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{section.details}</div>}
        {section.completedAt && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: 4 }}>
            Completed: {formatDateTime(section.completedAt)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function KYCPage() {
  const [kyc, setKyc] = useState<KYC | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/kyc")
      .then((r) => r.json())
      .then((d) => { setKyc(d.data); setLoading(false) })
  }, [])

  return (
    <DashboardLayout title="KYC & Verification" subtitle="Your account verification status">
      <div className="animate-fade-in" style={{ maxWidth: 680 }}>
        {loading ? (
          <div>
            <div className="skeleton" style={{ height: 100, borderRadius: 16, marginBottom: 20 }} />
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 13, width: "40%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 10, width: "65%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : kyc ? (
          <>
            {/* Overall status */}
            <div
              className="sv-card"
              style={{
                padding: "24px 28px",
                marginBottom: 24,
                background: kyc.overallStatus === "verified" ? "linear-gradient(135deg, #ecfdf5, #d1fae5)" : undefined,
                border: kyc.overallStatus === "verified" ? "1px solid rgba(22, 163, 122, 0.2)" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: kyc.overallStatus === "verified" ? "var(--success)" : "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck size={28} style={{ color: "white" }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: kyc.overallStatus === "verified" ? "var(--success)" : "var(--text-primary)", marginBottom: 4 }}>
                    {kyc.overallStatus === "verified" ? "Verification Complete" : "Verification In Progress"}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    Last updated: {formatDateTime(kyc.lastUpdated)}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Verification progress</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--success)" }}>
                    {kyc.sections.filter((s) => s.status === "verified").length} / {kyc.sections.length} complete
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${(kyc.sections.filter((s) => s.status === "verified").length / kyc.sections.length) * 100}%`,
                    borderRadius: 99,
                    background: "var(--success)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            </div>

            {/* KYC Sections */}
            <div className="sv-card" style={{ padding: "4px 24px 0" }}>
              {kyc.sections.map((section) => (
                <KYCSectionCard key={section.id} section={section} />
              ))}
            </div>

            {/* Information note */}
            <div style={{ marginTop: 20, padding: "14px 18px", background: "var(--blue-tint)", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <strong>Note:</strong> All KYC information shown is for demo purposes. In production, this would be connected to a licensed KYC/eKYC provider. Do not submit real sensitive information in this demo.
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
