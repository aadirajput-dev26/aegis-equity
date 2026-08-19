"use client"

import { useEffect, useState } from "react"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts"
import Link from "next/link"
import type { Portfolio, Holding, PortfolioPerformancePoint, AllocationItem } from "@/lib/types"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { formatINR, formatPercent } from "@/lib/utils"
import { portfolioAllocation } from "@/lib/mock-data"

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload?.length) {
    return (
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", boxShadow: "var(--shadow-md)", fontSize: "0.8125rem", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatINR(payload[0].value)}</div>
      </div>
    )
  }
  return null
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [chartData, setChartData] = useState<PortfolioPerformancePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/holdings").then((r) => r.json()),
      fetch("/api/portfolio/performance?range=1Y").then((r) => r.json()),
    ]).then(([p, h, c]) => {
      setPortfolio(p.data)
      setHoldings(h.data)
      setChartData(c.data)
      setLoading(false)
    })
  }, [])

  return (
    <DashboardLayout title="Portfolio" subtitle="Your private-market holdings">
      <div className="animate-fade-in">
        {/* Summary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="sv-card" style={{ padding: "18px 20px" }}>
                <div className="skeleton" style={{ height: 11, width: "55%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 26, width: "65%" }} />
              </div>
            ))
          ) : portfolio ? (
            [
              { label: "Total Value", value: formatINR(portfolio.totalValue), color: "var(--primary)" },
              { label: "Invested", value: formatINR(portfolio.investedValue), color: "var(--text-primary)" },
              { label: "Unrealised Gain", value: formatINR(portfolio.unrealisedGain), color: "var(--success)" },
              { label: "Return", value: formatPercent(portfolio.unrealisedGainPercent), color: "var(--success)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="sv-card" style={{ padding: "18px 20px" }}>
                <div className="micro-label" style={{ marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: "1.375rem", fontWeight: 700, color, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{value}</div>
              </div>
            ))
          ) : null}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 28 }}>
          {/* Performance Chart */}
          <div className="sv-card" style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 20 }}>Performance (12 months)</h2>
            {loading ? (
              <div className="skeleton" style={{ height: 220, borderRadius: 10 }} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'Outfit',sans-serif", fill: "var(--text-subtle)" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en-IN", { month: "short" })} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fontFamily: "'Outfit',sans-serif", fill: "var(--text-subtle)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v)} width={65} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fill="url(#sg2)" dot={false} activeDot={{ r: 4, fill: "#0ea5e9", stroke: "white", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Allocation Donut */}
          <div className="sv-card" style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>Allocation</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>By sector</p>
            {loading ? (
              <div className="skeleton" style={{ height: 180, borderRadius: 10 }} />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={portfolioAllocation} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {portfolioAllocation.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [formatINR(Number(v) || 0), "Value"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {portfolioAllocation.map(({ sector, percent, color }) => (
                    <div key={sector} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{sector}</span>
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{percent}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Holdings Table */}
        <div className="sv-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, margin: 0 }}>All Holdings</h2>
            <span className="badge badge-sky">{holdings.length} positions</span>
          </div>
          {loading ? (
            <div style={{ padding: "0 24px 24px" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
                  <div className="skeleton" style={{ height: 34, width: 34, borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 11, width: "40%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 9, width: "25%" }} />
                  </div>
                  <div className="skeleton" style={{ height: 11, width: "12%" }} />
                  <div className="skeleton" style={{ height: 11, width: "12%" }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="sv-table" aria-label="All holdings">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Category</th>
                    <th>Shares</th>
                    <th>Avg. Cost</th>
                    <th>Indicative Price</th>
                    <th>Current Value</th>
                    <th>Gain / Loss</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => (
                    <tr key={h.id} onClick={() => window.location.href = `/companies/${h.companyId}`}
                      tabIndex={0} onKeyDown={(e) => e.key === "Enter" && (window.location.href = `/companies/${h.companyId}`)}
                      aria-label={`View ${h.companyName}`}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>
                            {h.companyName.slice(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{h.companyName}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{h.companySector}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-navy">{h.companyCategory}</span></td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }}>{h.quantity.toLocaleString("en-IN")}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }}>{formatINR(h.averageCost)}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }}>{formatINR(h.indicativePrice)}</td>
                      <td style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{formatINR(h.currentValue)}</td>
                      <td>
                        <span className={h.gain >= 0 ? "change-positive" : "change-negative"} style={{ fontSize: "0.875rem" }}>
                          {h.gain >= 0 ? "+" : ""}{formatINR(Math.abs(h.gain))}
                          <br />
                          <span style={{ fontSize: "0.75rem" }}>{formatPercent(h.gainPercent)}</span>
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${h.companyStatus === "pre-ipo" ? "badge-sky" : "badge-navy"}`}>
                          {h.companyStatus === "pre-ipo" ? "Pre-IPO" : "Unlisted"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p style={{ marginTop: 20, fontSize: "0.75rem", color: "var(--text-subtle)", lineHeight: 1.6 }}>
          * All portfolio values are indicative and based on last available indicative prices. Actual transaction values may differ. This is not investment advice.
        </p>
      </div>
    </DashboardLayout>
  )
}
