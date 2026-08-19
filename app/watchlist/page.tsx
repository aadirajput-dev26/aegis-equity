"use client"

import { useEffect, useState } from "react"
import { Search, TrendingUp, TrendingDown, Bookmark, BookmarkX, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { WatchlistItem } from "@/lib/types"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { formatINR, formatPercent, formatDate } from "@/lib/utils"

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [removing, setRemoving] = useState<string | null>(null)

  const fetchWatchlist = () => {
    setLoading(true)
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((d) => { setItems(d.data); setLoading(false) })
  }

  useEffect(() => { fetchWatchlist() }, [])

  const removeItem = async (id: string) => {
    setRemoving(id)
    await fetch(`/api/watchlist/${id}`, { method: "DELETE" })
    setItems((prev) => prev.filter((w) => w.id !== id))
    setRemoving(null)
  }

  const filtered = items.filter(
    (item) =>
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.sector.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout title="Watchlist" subtitle="Companies you're watching">
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 360 }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} aria-hidden="true" />
            <input className="sv-input" style={{ paddingLeft: 40 }} placeholder="Search watchlist..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search watchlist" />
          </div>
          <Link href="/companies" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
            Explore Companies <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="sv-card" style={{ padding: 20 }}>
                <div className="skeleton" style={{ height: 13, width: "55%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 26, width: "40%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 10, width: "30%" }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Bookmark size={24} style={{ color: "var(--primary)" }} aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 8 }}>
              {search ? "No results found" : "Build your private-market watchlist"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 24, maxWidth: 360, margin: "0 auto 24px" }}>
              {search ? "Try a different search term." : "Save companies here to keep an eye on their indicative prices and updates."}
            </p>
            <Link href="/companies" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7 }}>
              Explore Companies <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="sv-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Watching {filtered.length} {filtered.length === 1 ? "company" : "companies"}</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="sv-table" aria-label="Watchlist">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Sector</th>
                    <th>Status</th>
                    <th>Indicative Price</th>
                    <th>Change</th>
                    <th>Last Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link href={`/companies/${item.companyId}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>
                            {item.companyName.slice(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.9rem" }}>{item.companyName}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.category}</div>
                          </div>
                        </Link>
                      </td>
                      <td style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{item.sector}</td>
                      <td><span className={`badge ${item.status === "pre-ipo" ? "badge-sky" : "badge-navy"}`}>{item.status === "pre-ipo" ? "Pre-IPO" : "Unlisted"}</span></td>
                      <td style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{formatINR(item.indicativePrice)}</td>
                      <td>
                        <span className={item.priceChange >= 0 ? "change-positive" : "change-negative"} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.875rem" }}>
                          {item.priceChange >= 0 ? <TrendingUp size={13} aria-hidden="true" /> : <TrendingDown size={13} aria-hidden="true" />}
                          {formatPercent(item.priceChangePercent)}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{formatDate(item.lastUpdated)}</td>
                      <td>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={removing === item.id}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 6, display: "flex", alignItems: "center", transition: "color 150ms ease" }}
                          aria-label={`Remove ${item.companyName} from watchlist`}
                        >
                          <BookmarkX size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
