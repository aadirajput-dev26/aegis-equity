"use client"

import { useEffect, useState } from "react"
import { Plus, FileText } from "lucide-react"
import type { Enquiry, Company } from "@/lib/types"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { formatINR, formatDate } from "@/lib/utils"

type FilterTab = "all" | "buy" | "sell" | "pending" | "completed"

const STATUS_STYLES: Record<Enquiry["status"], { bg: string; color: string; label: string }> = {
  pending: { bg: "var(--warning-bg)", color: "var(--warning)", label: "Pending" },
  "under-review": { bg: "var(--blue-tint)", color: "var(--primary)", label: "Under Review" },
  completed: { bg: "var(--success-bg)", color: "var(--success)", label: "Completed" },
  cancelled: { bg: "rgba(0,0,0,0.04)", color: "var(--text-muted)", label: "Cancelled" },
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<FilterTab>("all")
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ companyId: "", type: "buy" as "buy" | "sell", quantity: "", price: "", notes: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fetchEnquiries = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (tab === "buy" || tab === "sell") params.set("type", tab)
    if (tab === "pending") params.set("status", "pending")
    if (tab === "completed") params.set("status", "completed")
    fetch(`/api/enquiries?${params}`)
      .then((r) => r.json())
      .then((d) => { setEnquiries(d.data); setLoading(false) })
  }

  useEffect(() => { fetchEnquiries() }, [tab])

  useEffect(() => {
    fetch("/api/companies").then((r) => r.json()).then((d) => setCompanies(d.data))
  }, [])

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity), indicativePrice: Number(form.price) }),
    })
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => { setShowModal(false); setSubmitted(false); setForm({ companyId: "", type: "buy", quantity: "", price: "", notes: "" }); fetchEnquiries() }, 2000)
  }

  const TABS: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "buy", label: "Buy" },
    { id: "sell", label: "Sell" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
  ]

  return (
    <DashboardLayout title="Enquiries" subtitle="Your investment enquiry history">
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)" }} role="tablist">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                style={{
                  padding: "8px 18px",
                  borderBottom: tab === id ? "2px solid var(--primary)" : "2px solid transparent",
                  color: tab === id ? "var(--primary)" : "var(--text-muted)",
                  fontFamily: "'Outfit',sans-serif", fontSize: "0.875rem",
                  fontWeight: tab === id ? 600 : 400,
                  background: "none", border: "none", cursor: "pointer",
                  transition: "all 150ms ease", whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 7 }}
            aria-label="Create new enquiry"
          >
            <Plus size={15} aria-hidden="true" /> New Enquiry
          </button>
        </div>

        {/* Enquiries list */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="sv-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 13, width: "35%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 10, width: "50%" }} />
                  </div>
                  <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <FileText size={24} style={{ color: "var(--primary)" }} aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 8 }}>No enquiries yet</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 320, margin: "0 auto 24px" }}>
              Your investment enquiries will appear here. Submit a buy or sell enquiry to get started.
            </p>
            <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Plus size={14} aria-hidden="true" /> New Enquiry
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {enquiries.map((enq) => {
              const s = STATUS_STYLES[enq.status]
              return (
                <div key={enq.id} className="sv-card" style={{ padding: "18px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    {/* Type indicator */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: enq.type === "buy" ? "var(--blue-tint)" : "var(--danger-bg)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.625rem", fontWeight: 700,
                      color: enq.type === "buy" ? "var(--primary)" : "var(--danger)",
                      letterSpacing: "0.04em", flexShrink: 0,
                    }}>
                      {enq.type.toUpperCase()}
                    </div>

                    {/* Company + details */}
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: 4 }}>{enq.companyName}</div>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {enq.quantity.toLocaleString("en-IN")} shares
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          @ {formatINR(enq.indicativePrice)} indicative
                        </span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                          Total: {formatINR(enq.totalValue)}
                        </span>
                      </div>
                      {enq.notes && (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4, fontStyle: "italic" }}>
                          &ldquo;{enq.notes}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Status + date */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                      <span style={{ padding: "4px 12px", borderRadius: 99, background: s.bg, color: s.color, fontSize: "0.75rem", fontWeight: 600 }}>
                        {s.label}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>{formatDate(enq.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Enquiry Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(7,26,43,0.5)", backdropFilter: "blur(4px)" }} />
          <div className="sv-card" style={{ position: "relative", width: "100%", maxWidth: 480, padding: 32, zIndex: 61 }} role="dialog" aria-label="New enquiry form" aria-modal="true">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>✅</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Enquiry Submitted!</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Your enquiry has been submitted and is now pending review.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24 }}>New Enquiry</h3>
                <form onSubmit={submitEnquiry} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label htmlFor="enq-company" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>Company</label>
                    <select id="enq-company" className="sv-input" value={form.companyId} onChange={(e) => setForm(f => ({ ...f, companyId: e.target.value }))} required style={{ cursor: "pointer" }}>
                      <option value="">Select a company...</option>
                      {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>Enquiry Type</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(["buy", "sell"] as const).map((t) => (
                        <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                          flex: 1, padding: "10px", borderRadius: 10,
                          border: `1px solid ${form.type === t ? (t === "buy" ? "var(--primary)" : "var(--danger)") : "var(--border)"}`,
                          background: form.type === t ? (t === "buy" ? "var(--blue-tint)" : "var(--danger-bg)") : "white",
                          color: form.type === t ? (t === "buy" ? "var(--primary)" : "var(--danger)") : "var(--text-muted)",
                          fontFamily: "'Outfit',sans-serif", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
                          textTransform: "capitalize", transition: "all 150ms ease",
                        }} aria-pressed={form.type === t}>
                          {t === "buy" ? "Buy Enquiry" : "Sell Enquiry"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label htmlFor="enq-qty2" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>Quantity</label>
                      <input id="enq-qty2" className="sv-input" type="number" min="1" placeholder="Shares" value={form.quantity} onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))} required />
                    </div>
                    <div>
                      <label htmlFor="enq-price2" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>Indicative Price (₹)</label>
                      <input id="enq-price2" className="sv-input" type="number" min="0.01" step="0.01" placeholder="Per share" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="enq-notes2" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>Notes (optional)</label>
                    <textarea id="enq-notes2" className="sv-input" rows={2} placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} style={{ height: "auto", resize: "vertical" }} />
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={submitting} aria-busy={submitting}>
                      {submitting ? "Submitting..." : "Submit Enquiry"}
                    </button>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", textAlign: "center", margin: 0 }}>Indicative and subject to availability. Not a trade confirmation.</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
