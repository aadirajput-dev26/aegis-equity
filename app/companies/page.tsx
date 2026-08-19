"use client"

import { useEffect, useState } from "react"
import { Search, SlidersHorizontal, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import type { Company } from "@/lib/types"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { formatINR, formatPercent } from "@/lib/utils"

const SECTORS = ["All", "Financial Infrastructure", "Financial Services", "Technology", "Consumer Technology", "Renewable Energy"]
const STATUSES = ["All", "unlisted", "pre-ipo"]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sector, setSector] = useState("All")
  const [status, setStatus] = useState("All")

  const fetchCompanies = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (sector !== "All") params.set("sector", sector)
    if (status !== "All") params.set("status", status)
    fetch(`/api/companies?${params}`)
      .then((r) => r.json())
      .then((d) => { setCompanies(d.data); setLoading(false) })
  }

  useEffect(() => { fetchCompanies() }, [search, sector, status])

  return (
    <DashboardLayout title="Companies" subtitle="Private & pre-IPO company directory">
      <div className="animate-fade-in">
        {/* Search + Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} aria-hidden="true" />
            <input
              className="sv-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search companies"
            />
          </div>

          {/* Sector filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={s === sector ? "" : ""}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: `1px solid ${sector === s ? "var(--primary)" : "var(--border)"}`,
                  background: sector === s ? "var(--blue-tint)" : "white",
                  color: sector === s ? "var(--primary)" : "var(--text-muted)",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: sector === s ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  whiteSpace: "nowrap",
                }}
                aria-pressed={sector === s}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", gap: 4, background: "var(--muted)", borderRadius: 8, padding: 3, border: "1px solid var(--border)" }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: status === s ? "white" : "transparent",
                  color: status === s ? "var(--text-primary)" : "var(--text-muted)",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: status === s ? 600 : 400,
                  cursor: "pointer",
                  boxShadow: status === s ? "var(--shadow-xs)" : "none",
                  transition: "all 150ms ease",
                  whiteSpace: "nowrap",
                }}
                aria-pressed={status === s}
              >
                {s === "All" ? "All" : s === "pre-ipo" ? "Pre-IPO" : "Unlisted"}
              </button>
            ))}
          </div>
        </div>

        {/* Company Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="sv-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 13, width: "60%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: "40%" }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: 10, width: "90%", marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 10, width: "70%" }} />
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 8 }}>No companies found</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 20 }}>
              Try adjusting your search or filters.
            </p>
            <button className="btn-secondary" onClick={() => { setSearch(""); setSector("All"); setStatus("All") }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className="stagger"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}
          >
            {companies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`} style={{ textDecoration: "none" }}>
                <div
                  className="sv-card animate-fade-in-up"
                  style={{ padding: "20px", cursor: "pointer", height: "100%" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: "var(--blue-tint)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.6875rem", fontWeight: 700, color: "var(--primary)",
                        letterSpacing: "0.02em", flexShrink: 0,
                      }}>
                        {company.logoInitials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)", lineHeight: 1.3 }}>{company.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{company.category}</div>
                      </div>
                    </div>
                    <span className={`badge ${company.status === "pre-ipo" ? "badge-sky" : "badge-navy"}`}>
                      {company.status === "pre-ipo" ? "Pre-IPO" : "Unlisted"}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {company.description}
                  </p>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="micro-label" style={{ marginBottom: 2 }}>Indicative Price</div>
                      <div style={{ fontWeight: 700, fontSize: "1.0625rem", fontVariantNumeric: "tabular-nums", color: "var(--text-primary)" }}>
                        {formatINR(company.indicativePrice)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="micro-label" style={{ marginBottom: 2 }}>Change</div>
                      <span className={company.priceChange >= 0 ? "change-positive" : "change-negative"} style={{ fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 3 }}>
                        {company.priceChange >= 0
                          ? <TrendingUp size={13} aria-hidden="true" />
                          : <TrendingDown size={13} aria-hidden="true" />}
                        {formatPercent(company.priceChangePercent)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
