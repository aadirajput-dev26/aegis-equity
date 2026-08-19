"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, ArrowRight, Building2, Wallet } from "lucide-react"
import Link from "next/link"
import type { Portfolio, PortfolioPerformancePoint, Holding } from "@/lib/types"
import { formatINR, formatPercent } from "@/lib/utils"

type Range = "1M" | "3M" | "6M" | "1Y" | "ALL"

function SkeletonCard() {
  return (
    <div className="sv-card" style={{ padding: "20px 24px", minHeight: 100 }}>
      <div className="skeleton" style={{ height: 12, width: "45%", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 28, width: "60%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 10, width: "30%" }} />
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="sv-card" style={{ padding: "24px", height: 340 }}>
      <div className="skeleton" style={{ height: 14, width: "25%", marginBottom: 20 }} />
      <div className="skeleton" style={{ height: "80%", width: "100%", borderRadius: 12 }} />
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="sv-card" style={{ padding: "24px" }}>
      <div className="skeleton" style={{ height: 14, width: "20%", marginBottom: 20 }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
          <div className="skeleton" style={{ height: 32, width: 32, borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 11, width: "40%", marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 9, width: "25%" }} />
          </div>
          <div className="skeleton" style={{ height: 11, width: "15%" }} />
          <div className="skeleton" style={{ height: 11, width: "12%" }} />
        </div>
      ))}
    </div>
  )
}

const RANGES: Range[] = ["1M", "3M", "6M", "1Y", "ALL"]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: "0.8125rem",
        fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9375rem" }}>
          {formatINR(payload[0].value)}
        </div>
      </div>
    )
  }
  return null
}

export function DashboardClient() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [chartData, setChartData] = useState<PortfolioPerformancePoint[]>([])
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [range, setRange] = useState<Range>("1Y")
  const [loadingPortfolio, setLoadingPortfolio] = useState(true)
  const [loadingChart, setLoadingChart] = useState(true)
  const [loadingHoldings, setLoadingHoldings] = useState(true)

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => { setPortfolio(d.data); setLoadingPortfolio(false) })
  }, [])

  useEffect(() => {
    setLoadingChart(true)
    fetch(`/api/portfolio/performance?range=${range}`)
      .then((r) => r.json())
      .then((d) => { setChartData(d.data); setLoadingChart(false) })
  }, [range])

  useEffect(() => {
    fetch("/api/holdings")
      .then((r) => r.json())
      .then((d) => { setHoldings(d.data.slice(0, 5)); setLoadingHoldings(false) })
  }, [])

  const summaryCards = portfolio
    ? [
        {
          label: "Total Portfolio Value",
          value: formatINR(portfolio.totalValue),
          sub: "Indicative",
          icon: Wallet,
          accent: "var(--primary)",
          positive: true,
        },
        {
          label: "Invested Value",
          value: formatINR(portfolio.investedValue),
          sub: "Capital deployed",
          icon: Building2,
          accent: "var(--text-secondary)",
          positive: null,
        },
        {
          label: "Unrealised Gain",
          value: formatINR(portfolio.unrealisedGain),
          sub: formatPercent(portfolio.unrealisedGainPercent),
          icon: TrendingUp,
          accent: "var(--success)",
          positive: portfolio.unrealisedGain >= 0,
        },
        {
          label: "Holdings",
          value: String(portfolio.holdingsCount),
          sub: "Private companies",
          icon: Building2,
          accent: "var(--primary)",
          positive: null,
        },
      ]
    : []

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Good morning, Arjun ☀️
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
          Here&apos;s an overview of your private-market portfolio.
        </p>
      </div>

      {/* Summary Cards */}
      <div
        className="stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {loadingPortfolio
          ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          : summaryCards.map(({ label, value, sub, icon: Icon, accent, positive }) => (
              <div
                key={label}
                className="sv-card animate-fade-in-up"
                style={{ padding: "20px 24px" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span className="micro-label">{label}</span>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${accent}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={16} style={{ color: accent }} aria-hidden="true" />
                  </div>
                </div>
                <div className="stat-value" style={{ color: positive === null ? "var(--text-primary)" : positive ? "var(--success)" : "var(--danger)", marginBottom: 4 }}>
                  {positive === true && value !== "0" && <TrendingUp size={18} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} aria-hidden="true" />}
                  {positive === false && <TrendingDown size={18} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} aria-hidden="true" />}
                  {value}
                </div>
                <div style={{ fontSize: "0.8125rem", color: positive ? "var(--success)" : "var(--text-muted)", fontWeight: 500 }}>
                  {sub}
                </div>
              </div>
            ))}
      </div>

      {/* Portfolio Chart */}
      <div className="sv-card animate-fade-in-up" style={{ padding: "24px", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, margin: 0, marginBottom: 2 }}>Portfolio value</h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>Indicative performance over time</p>
          </div>
          {/* Range selector */}
          <div style={{ display: "flex", gap: 4, background: "var(--muted)", borderRadius: 10, padding: 3, border: "1px solid var(--border)" }} role="group" aria-label="Chart range">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                style={{
                  padding: "5px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: range === r ? "white" : "transparent",
                  color: range === r ? "var(--text-primary)" : "var(--text-muted)",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: range === r ? 600 : 400,
                  cursor: "pointer",
                  boxShadow: range === r ? "var(--shadow-xs)" : "none",
                  transition: "all 150ms ease",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loadingChart ? (
          <div className="skeleton" style={{ height: 240, borderRadius: 12 }} />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fill: "var(--text-subtle)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  const d = new Date(v)
                  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fill: "var(--text-subtle)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatINR(v)}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#skyGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Holdings */}
      <div className="sv-card animate-fade-in-up" style={{ overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, margin: 0 }}>Top Holdings</h2>
          <Link
            href="/portfolio"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}
          >
            View all <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>

        {loadingHoldings ? (
          <div style={{ padding: "0 24px 24px" }}>
            <SkeletonTable />
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="sv-table" aria-label="Top holdings">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Shares</th>
                  <th>Avg. Cost</th>
                  <th>Indicative Price</th>
                  <th>Current Value</th>
                  <th>Gain / Loss</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr
                    key={h.id}
                    onClick={() => window.location.href = `/companies/${h.companyId}`}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && (window.location.href = `/companies/${h.companyId}`)}
                    aria-label={`View ${h.companyName} details`}
                  >
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 8,
                          background: "var(--blue-tint)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.625rem", fontWeight: 700, color: "var(--primary)",
                          letterSpacing: "0.02em", flexShrink: 0,
                        }}>
                          {h.companyName.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{h.companyName}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{h.companySector}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{h.quantity.toLocaleString("en-IN")}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{formatINR(h.averageCost)}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{formatINR(h.indicativePrice)}</td>
                    <td style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{formatINR(h.currentValue)}</td>
                    <td>
                      <span className={h.gain >= 0 ? "change-positive" : "change-negative"} style={{ fontSize: "0.875rem" }}>
                        {h.gain >= 0 ? "+" : ""}{formatINR(Math.abs(h.gain))}
                        <span style={{ fontSize: "0.75rem", marginLeft: 4 }}>({formatPercent(h.gainPercent)})</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
