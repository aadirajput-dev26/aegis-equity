"use client"

import Link from "next/link"
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  PieChart,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  BarChart3,
  HelpCircle,
  FileCheck,
} from "lucide-react"
import { AegisEquityLogo } from "@/components/ui/logo"
import { formatINR, formatPercent } from "@/lib/utils"

const featuredCompanies = [
  {
    id: "nse-india",
    name: "NSE India",
    category: "Financial Infrastructure",
    indicativePrice: 1998,
    change: 4.06,
    status: "unlisted",
    initials: "NSE",
  },
  {
    id: "hdfc-securities",
    name: "HDFC Securities",
    category: "Broking & Wealth",
    indicativePrice: 3450,
    change: 2.07,
    status: "pre-ipo",
    initials: "HDFC",
  },
  {
    id: "tata-capital",
    name: "Tata Capital",
    category: "NBFC & Lending",
    indicativePrice: 950,
    change: 4.4,
    status: "pre-ipo",
    initials: "TC",
  },
  {
    id: "swiggy",
    name: "Swiggy",
    category: "Food & Quick Commerce",
    indicativePrice: 395,
    change: 5.33,
    status: "unlisted",
    initials: "SWG",
  },
  {
    id: "waaree-energies",
    name: "Waaree Energies",
    category: "Solar Manufacturing",
    indicativePrice: 1850,
    change: 3.93,
    status: "pre-ipo",
    initials: "WE",
  },
  {
    id: "hexaware",
    name: "Hexaware Technologies",
    category: "IT Services",
    indicativePrice: 755,
    change: 2.03,
    status: "pre-ipo",
    initials: "HEX",
  },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
      {/* ─── PUBLIC NAVBAR ────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(247, 252, 255, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 32px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <AegisEquityLogo variant="dark" size="md" href="/" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
            className="landing-nav-links"
          >
            <Link
              href="/companies"
              style={{
                fontSize: "0.9375rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 150ms ease",
              }}
            >
              Companies
            </Link>
            <Link
              href="/portfolio"
              style={{
                fontSize: "0.9375rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Portfolio Tracker
            </Link>
            <Link
              href="/watchlist"
              style={{
                fontSize: "0.9375rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Watchlist
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/login"
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontWeight: 500,
              padding: "8px 16px",
            }}
          >
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          padding: "72px 32px 88px",
          maxWidth: 1200,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial accents */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: 0,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }} className="hero-grid">
          {/* Left Hero Content */}
          <div>
            <div
              className="eyebrow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: "var(--blue-tint)",
                borderRadius: 99,
                border: "1px solid var(--border)",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--primary)",
                }}
              />
              PRIVATE MARKETS, SIMPLIFIED
            </div>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: "-0.025em",
                color: "var(--navy-900)",
                marginBottom: 24,
              }}
            >
              Manage your private investments with{" "}
              <span style={{ color: "var(--bright-sky)" }}>clarity.</span>
            </h1>

            <p
              style={{
                fontSize: "1.125rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 520,
                marginBottom: 36,
              }}
            >
              Track unlisted and pre-IPO holdings, discover high-growth private companies, and manage investment enquiries from one elegant workspace.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
              <Link href="/signup" className="btn-primary" style={{ padding: "14px 28px", fontSize: "1rem" }}>
                Get started <ArrowRight size={17} />
              </Link>
              <Link href="/companies" className="btn-secondary" style={{ padding: "14px 28px", fontSize: "1rem" }}>
                Explore companies
              </Link>
            </div>

            {/* Quick feature pill row */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <CheckCircle2 size={16} style={{ color: "var(--success)" }} /> Verified Demat Settlement
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <CheckCircle2 size={16} style={{ color: "var(--success)" }} /> Indicative Live Pricing
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <CheckCircle2 size={16} style={{ color: "var(--success)" }} /> Bank-grade Security
              </div>
            </div>
          </div>

          {/* Right Hero Preview Card */}
          <div
            className="sv-card"
            style={{
              padding: "28px",
              background: "white",
              borderRadius: 20,
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--border)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div className="micro-label">Indicative Portfolio Value</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                  ₹24,86,500
                </div>
              </div>
              <span className="badge badge-success" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>
                +35.0% Overall
              </span>
            </div>

            {/* Mini Chart Mockup Line */}
            <div
              style={{
                height: 90,
                width: "100%",
                background: "linear-gradient(180deg, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0) 100%)",
                borderRadius: 12,
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "flex-end",
                padding: "8px 12px",
                marginBottom: 20,
                position: "relative",
              }}
            >
              <svg width="100%" height="60" viewBox="0 0 300 60" fill="none" preserveAspectRatio="none">
                <path
                  d="M0 50 Q 50 40, 100 35 T 200 20 T 300 8"
                  stroke="var(--bright-sky)"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
            </div>

            {/* Sample Holding Rows in Hero */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "NSE India", qty: "100 shares", val: "₹1,99,800", gain: "+21.09%" },
                { name: "Tata Capital", qty: "250 shares", val: "₹2,37,500", gain: "+15.85%" },
                { name: "Waaree Energies", qty: "120 shares", val: "₹2,22,000", gain: "+30.28%" },
              ].map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "var(--muted)",
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.qty}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.val}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--success)" }}>{item.gain}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Link
                href="/dashboard"
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Launch interactive workspace demo <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY SKYVEST ────────────────────────────────────────── */}
      <section style={{ padding: "80px 32px", background: "white", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>PLATFORM CAPABILITIES</div>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Why serious investors choose SkyVest
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 600, margin: "12px auto 0" }}>
              Built specifically for unlisted shares, pre-IPO opportunities, and private market assets.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              {
                icon: PieChart,
                title: "Portfolio Clarity",
                desc: "Gain instant visibility into your entire unlisted portfolio, total invested capital, and unrealised gains across private holdings.",
              },
              {
                icon: BarChart3,
                title: "Indicative Valuations",
                desc: "Monitor realistic price benchmarks curated from secondary transactions and verified dealer quotes in real-time.",
              },
              {
                icon: Search,
                title: "Private-Market Research",
                desc: "Access financial snapshots, shareholding patterns, promoter information, and statutory filings on unlisted leaders.",
              },
              {
                icon: Lock,
                title: "Secure Access",
                desc: "Passwordless OTP authentication, encrypted session management, and streamlined KYC document validation.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="sv-card"
                style={{ padding: "32px 28px", display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--blue-tint)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Icon size={22} style={{ color: "var(--primary)" }} />
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6, flex: 1 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COMPANIES ─────────────────────────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>MARKET DIRECTORY</div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
              Featured Private Companies
            </h2>
          </div>
          <Link href="/companies" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            View all companies <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
          {featuredCompanies.map((c) => (
            <Link key={c.id} href={`/companies/${c.id}`} style={{ textDecoration: "none" }}>
              <div className="sv-card" style={{ padding: "22px", height: "100%", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: "var(--blue-tint)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--primary)",
                      }}
                    >
                      {c.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>{c.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.category}</div>
                    </div>
                  </div>
                  <span className={`badge ${c.status === "pre-ipo" ? "badge-sky" : "badge-navy"}`}>
                    {c.status === "pre-ipo" ? "Pre-IPO" : "Unlisted"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  <div>
                    <div className="micro-label" style={{ marginBottom: 2 }}>Indicative Price</div>
                    <div style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                      {formatINR(c.indicativePrice)}
                    </div>
                  </div>
                  <span className="change-positive" style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 3 }}>
                    <TrendingUp size={13} /> {formatPercent(c.change)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────── */}
      <section style={{ padding: "80px 32px", background: "var(--navy-900)", color: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="eyebrow-dark" style={{ marginBottom: 8 }}>SEAMLESS WORKFLOW</div>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>
              How SkyVest works
            </h2>
            <p style={{ color: "rgba(199, 223, 232, 0.75)", fontSize: "1rem", maxWidth: 550, margin: "12px auto 0" }}>
              Four simple steps from account setup to executing off-market enquiries.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up instantly via email or mobile OTP verification. No lengthy paperwork to browse.",
              },
              {
                step: "02",
                title: "Explore private companies",
                desc: "Browse unlisted market leaders, filter by sectors, and monitor indicative price trends.",
              },
              {
                step: "03",
                title: "Track your portfolio",
                desc: "Add existing shareholdings to visualize asset allocation, performance, and unrealised gains.",
              },
              {
                step: "04",
                title: "Submit an enquiry",
                desc: "Submit buy or sell enquiries directly to experienced private-market liquidity partners.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 16,
                  padding: "32px 24px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "var(--sky-400)",
                    marginBottom: 16,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {step}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "white", marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(199, 223, 232, 0.65)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section style={{ padding: "96px 32px", textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>READY TO START?</div>
        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 20 }}>
          Your private portfolio deserves a better workspace.
        </h2>
        <p style={{ fontSize: "1.0625rem", color: "var(--text-muted)", marginBottom: 36, lineHeight: 1.6 }}>
          Join high-net-worth investors, family offices, and tech executives tracking their pre-IPO assets on SkyVest.
        </p>
        <Link href="/signup" className="btn-primary" style={{ padding: "14px 32px", fontSize: "1.0625rem" }}>
          Create your account <ArrowRight size={18} />
        </Link>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: "white", borderTop: "1px solid var(--border)", padding: "48px 32px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <AegisEquityLogo variant="dark" size="md" href="/" />
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 8 }}>
                Private markets, clearly managed.
              </p>
            </div>
            <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
              <div>
                <div className="micro-label" style={{ marginBottom: 12 }}>Platform</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.875rem" }}>
                  <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Dashboard</Link>
                  <Link href="/portfolio" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Portfolio</Link>
                  <Link href="/companies" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Companies</Link>
                  <Link href="/watchlist" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Watchlist</Link>
                </div>
              </div>
              <div>
                <div className="micro-label" style={{ marginBottom: 12 }}>Account</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.875rem" }}>
                  <Link href="/signup" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Create Account</Link>
                  <Link href="/login" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Sign In</Link>
                  <Link href="/kyc" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>KYC Status</Link>
                  <Link href="/help" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Help & FAQ</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div
            style={{
              padding: "20px",
              background: "var(--muted)",
              borderRadius: 12,
              border: "1px solid var(--border)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            <strong>Regulatory Disclaimer:</strong> SkyVest is a private-market portfolio and enquiry platform. Indicative prices and valuations are for informational purposes only and may differ from actual transaction values. Nothing on the platform constitutes investment, legal, tax or financial advice. Pre-IPO and unlisted securities are subject to market risks, liquidity constraints, and regulatory rules. All company and valuation data displayed in this prototype are simulated/mock data.
          </div>

          <div style={{ marginTop: 24, textAlign: "center", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
            © 2026 SkyVest Technologies Inc. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .landing-nav-links { display: none !important; }
        }
      `}</style>
    </div>
  )
}
