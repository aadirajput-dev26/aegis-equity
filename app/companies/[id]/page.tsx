"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  TrendingUp, TrendingDown, Bookmark, BookmarkCheck,
  ArrowLeft, Calendar, MapPin, Users, Building2
} from "lucide-react"
import type { Company } from "@/lib/types"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { formatINR, formatPercent, formatDate } from "@/lib/utils"

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [inWatchlist, setInWatchlist] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [enquiryType, setEnquiryType] = useState<"buy" | "sell">("buy")
  const [enquiryForm, setEnquiryForm] = useState({ quantity: "", price: "", notes: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetch(`/api/companies/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCompany(d.data)
        else setNotFound(true)
        setLoading(false)
      })
    // Check watchlist
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((d) => setInWatchlist(d.data.some((w: { companyId: string }) => w.companyId === id)))
  }, [id])

  const toggleWatchlist = async () => {
    setWatchlistLoading(true)
    if (inWatchlist) {
      await fetch(`/api/watchlist/${id}`, { method: "DELETE" })
      setInWatchlist(false)
    } else {
      await fetch("/api/watchlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ companyId: id }) })
      setInWatchlist(true)
    }
    setWatchlistLoading(false)
  }

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId: id,
        type: enquiryType,
        quantity: Number(enquiryForm.quantity),
        indicativePrice: Number(enquiryForm.price),
        notes: enquiryForm.notes,
      }),
    })
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => { setShowEnquiry(false); setSubmitted(false); setEnquiryForm({ quantity: "", price: "", notes: "" }) }, 2000)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
            <div className="skeleton" style={{ width: 64, height: 64, borderRadius: 14 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 22, width: "35%", marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 13, width: "22%" }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 80, width: "100%", borderRadius: 12, marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 200, width: "100%", borderRadius: 12 }} />
        </div>
      </DashboardLayout>
    )
  }

  if (notFound || !company) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2 style={{ marginBottom: 12 }}>Company not found</h2>
          <button className="btn-primary" onClick={() => router.push("/companies")}>Back to Companies</button>
        </div>
      </DashboardLayout>
    )
  }

  const tabs = ["overview", "metrics", "valuation", "events", "documents"]

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 20, padding: 0, fontFamily: "inherit" }}
          aria-label="Go back"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back
        </button>

        {/* Header */}
        <div className="sv-card" style={{ padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            {/* Logo */}
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: "var(--blue-tint)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)",
              letterSpacing: "0.04em", flexShrink: 0,
            }}>
              {company.logoInitials}
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <h1 style={{ fontSize: "1.5rem", margin: 0 }}>{company.name}</h1>
                <span className={`badge ${company.status === "pre-ipo" ? "badge-sky" : "badge-navy"}`}>
                  {company.status === "pre-ipo" ? "Pre-IPO" : "Unlisted"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{company.category}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={12} aria-hidden="true" />{company.headquarters}
                </span>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-subtle)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={12} aria-hidden="true" /> Updated {formatDate(company.lastUpdated)}
                </span>
              </div>
            </div>

            {/* Price */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div className="micro-label" style={{ marginBottom: 4 }}>Indicative Price</div>
              <div style={{ fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                {formatINR(company.indicativePrice)}
              </div>
              <div className={company.priceChange >= 0 ? "change-positive" : "change-negative"} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 4, fontSize: "0.875rem" }}>
                {company.priceChange >= 0 ? <TrendingUp size={14} aria-hidden="true" /> : <TrendingDown size={14} aria-hidden="true" />}
                {formatINR(Math.abs(company.priceChange))} ({formatPercent(company.priceChangePercent)})
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <button
              className="btn-secondary"
              onClick={toggleWatchlist}
              disabled={watchlistLoading}
              style={{ display: "flex", alignItems: "center", gap: 7 }}
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {inWatchlist ? <BookmarkCheck size={15} aria-hidden="true" /> : <Bookmark size={15} aria-hidden="true" />}
              {inWatchlist ? "Watchlisted" : "Add to Watchlist"}
            </button>
            <button className="btn-primary" onClick={() => { setEnquiryType("buy"); setShowEnquiry(true) }} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              Buy Enquiry
            </button>
            <button
              onClick={() => { setEnquiryType("sell"); setShowEnquiry(true) }}
              style={{
                padding: "10px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--danger)",
                background: "transparent", color: "var(--danger)", fontFamily: "'Outfit',sans-serif",
                fontSize: "0.9375rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
              }}
              aria-label="Submit sell enquiry"
            >
              Sell Enquiry
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: "1px solid var(--border)", overflowX: "auto" }} role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
                color: activeTab === tab ? "var(--primary)" : "var(--text-muted)",
                fontFamily: "'Outfit',sans-serif", fontSize: "0.875rem",
                fontWeight: activeTab === tab ? 600 : 400,
                background: "none", border: "none",
                borderRadius: "0px", cursor: "pointer",
                textTransform: "capitalize", transition: "all 150ms ease",
                whiteSpace: "nowrap",
              }}
            >
              {tab === "events" ? "Recent Events" : tab === "documents" ? "Documents" : tab === "valuation" ? "Valuation" : tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div className="sv-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 16 }}>About {company.name}</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 24 }}>{company.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {[
                { label: "Founded", value: company.founded, icon: Calendar },
                { label: "Headquarters", value: company.headquarters, icon: MapPin },
                { label: "Employees", value: company.employees, icon: Users },
                { label: "Promoters", value: company.promoters, icon: Building2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ padding: "14px 16px", background: "var(--muted)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <Icon size={13} style={{ color: "var(--primary)" }} aria-hidden="true" />
                    <span className="micro-label">{label}</span>
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="sv-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 16 }}>Key Metrics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { label: "Revenue (FY24)", value: company.revenue },
                { label: "Indicative Valuation", value: company.valuation },
                { label: "Indicative Price", value: formatINR(company.indicativePrice) },
                { label: "Sector", value: company.sector },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "14px 16px", background: "var(--muted)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div className="micro-label" style={{ marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "12px 16px", background: "var(--warning-bg)", borderRadius: 10, border: "1px solid rgba(217, 154, 36, 0.2)", fontSize: "0.8rem", color: "var(--warning)" }}>
              ⚠️ All financial metrics are indicative and based on publicly available information. SkyVest does not guarantee their accuracy.
            </div>
          </div>
        )}

        {activeTab === "valuation" && (
          <div className="sv-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 16 }}>Indicative Valuation</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { label: "Enterprise Value (Indicative)", value: company.valuation },
                { label: "Latest Price / Share", value: formatINR(company.indicativePrice) },
                { label: "Price Change (Last Update)", value: `${formatINR(company.priceChange)} (${formatPercent(company.priceChangePercent)})` },
                { label: "Status", value: company.status === "pre-ipo" ? "Pre-IPO" : "Unlisted" },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "16px", background: "var(--muted)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div className="micro-label" style={{ marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text-primary)" }}>{value}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", lineHeight: 1.6 }}>
              Valuations are indicative estimates based on peer comparables and available data. They do not represent guaranteed transaction prices. Subject to change without notice.
            </p>
          </div>
        )}

        {activeTab === "events" && (
          <div className="sv-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 20 }}>Recent Events</h2>
            {[
              { date: "Aug 2026", title: "Q1 FY27 results announced", desc: "Revenue growth of 18% YoY reported in preliminary filings." },
              { date: "Jul 2026", title: "New board member appointment", desc: "Appointment of an independent director with BFSI background." },
              { date: "Jun 2026", title: "Expansion into Tier 2 markets", desc: "Strategic expansion announced across 12 Tier 2 cities." },
              { date: "May 2026", title: "Indicative price update", desc: "Indicative price revised based on latest secondary market transactions." },
            ].map(({ date, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
                <div style={{ flexShrink: 0, width: 70, fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, paddingTop: 2 }}>{date}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="sv-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 20 }}>Documents</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 20 }}>Verified documents are available to KYC-verified investors.</p>
            {["Annual Report FY24", "Shareholding Pattern Q1 FY27", "Board Resolution – Jul 2026", "Indicative Valuation Note"].map((doc) => (
              <div key={doc} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--primary)" }}>PDF</span>
                  </div>
                  <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{doc}</span>
                </div>
                <span className="badge badge-sky">Verified</span>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ marginTop: 20, fontSize: "0.75rem", color: "var(--text-subtle)", lineHeight: 1.6 }}>
          Indicative prices are not guaranteed transaction prices. SkyVest is a private-market enquiry platform, not a trading exchange.
        </p>
      </div>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={() => setShowEnquiry(false)} style={{ position: "absolute", inset: 0, background: "rgba(7,26,43,0.5)", backdropFilter: "blur(4px)" }} />
          <div className="sv-card" style={{ position: "relative", width: "100%", maxWidth: 480, padding: 32, zIndex: 61 }} role="dialog" aria-label="Submit enquiry" aria-modal="true">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>✅</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Enquiry Submitted</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Your {enquiryType} enquiry for {company.name} has been submitted. We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>New Enquiry</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "4px 0 0" }}>{company.name}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["buy", "sell"] as const).map((t) => (
                      <button key={t} onClick={() => setEnquiryType(t)} style={{
                        padding: "6px 16px", borderRadius: 8,
                        border: `1px solid ${enquiryType === t ? (t === "buy" ? "var(--primary)" : "var(--danger)") : "var(--border)"}`,
                        background: enquiryType === t ? (t === "buy" ? "var(--blue-tint)" : "var(--danger-bg)") : "transparent",
                        color: enquiryType === t ? (t === "buy" ? "var(--primary)" : "var(--danger)") : "var(--text-muted)",
                        fontFamily: "'Outfit',sans-serif", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
                        textTransform: "capitalize", transition: "all 150ms ease",
                      }} aria-pressed={enquiryType === t}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <form onSubmit={submitEnquiry} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label htmlFor="enq-qty" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>Quantity (shares)</label>
                    <input id="enq-qty" className="sv-input" type="number" min="1" placeholder="e.g. 100" value={enquiryForm.quantity} onChange={(e) => setEnquiryForm(f => ({ ...f, quantity: e.target.value }))} required />
                  </div>
                  <div>
                    <label htmlFor="enq-price" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                      Indicative Price (₹)
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: 8 }}>Current: {formatINR(company.indicativePrice)}</span>
                    </label>
                    <input id="enq-price" className="sv-input" type="number" min="0.01" step="0.01" placeholder={String(company.indicativePrice)} value={enquiryForm.price} onChange={(e) => setEnquiryForm(f => ({ ...f, price: e.target.value }))} required />
                  </div>
                  <div>
                    <label htmlFor="enq-notes" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>Notes (optional)</label>
                    <textarea id="enq-notes" className="sv-input" rows={3} placeholder="Additional information or requirements..." value={enquiryForm.notes} onChange={(e) => setEnquiryForm(f => ({ ...f, notes: e.target.value }))} style={{ height: "auto", resize: "vertical" }} />
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowEnquiry(false)} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={submitting} aria-busy={submitting}>
                      {submitting ? "Submitting..." : "Submit Enquiry"}
                    </button>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", textAlign: "center", margin: 0 }}>
                    Enquiries are indicative and subject to availability. Not a trade confirmation.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
