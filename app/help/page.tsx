"use client"

import { HelpCircle, Mail, Phone, FileText, ChevronRight, ShieldAlert } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"

export default function HelpPage() {
  const faqs = [
    {
      q: "What is an indicative price?",
      a: "An indicative price is an estimated market price based on recent transactions, peer benchmarks, and institutional dealer quotes in the private/unlisted market. It is not an exchange-guaranteed price.",
    },
    {
      q: "How does the enquiry process work?",
      a: "When you submit a Buy or Sell enquiry, our private-market desk connects with certified liquidity partners to verify availability and match suitable counter-parties. Once confirmed, off-market transfer documents and demat settlement instructions are initiated.",
    },
    {
      q: "Are shares transferred directly to my Demat account?",
      a: "Yes. All unlisted and pre-IPO shares are credited straight to your CDSL/NSDL Demat account via standard DIS / off-market electronic transfer.",
    },
    {
      q: "What documentation is required to trade unlisted shares?",
      a: "You need a valid PAN, verified Demat account client master list (CML), Aadhaar for e-sign, and an active bank account.",
    },
  ]

  return (
    <DashboardLayout title="Help & Support" subtitle="Frequently asked questions and client assistance">
      <div className="animate-fade-in" style={{ maxWidth: 800 }}>
        {/* Contact Strip */}
        <div
          className="sv-card"
          style={{
            padding: "24px",
            marginBottom: 28,
            background: "linear-gradient(135deg, #071a2b 0%, #0d2638 100%)",
            color: "white",
            border: "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="eyebrow-dark" style={{ marginBottom: 6, display: "block" }}>
                Dedicated Support Desk
              </span>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "white", marginBottom: 6 }}>
                Need assistance with an enquiry?
              </h2>
              <p style={{ fontSize: "0.875rem", color: "rgba(199, 223, 232, 0.75)", maxWidth: 450 }}>
                Our private wealth relationship team is available Monday to Friday, 9:00 AM - 6:30 PM IST.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <a
                href="mailto:support@skyvest.in"
                className="btn-primary"
                style={{ fontSize: "0.85rem", padding: "8px 16px" }}
              >
                <Mail size={14} /> Email Support
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="sv-card" style={{ padding: "28px", marginBottom: 28 }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 20 }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {faqs.map(({ q, a }, idx) => (
              <div
                key={idx}
                style={{
                  paddingBottom: 18,
                  borderBottom: idx === faqs.length - 1 ? "none" : "1px solid var(--border)",
                }}
              >
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                  {q}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Warning */}
        <div
          style={{
            padding: "16px 20px",
            background: "var(--blue-tint)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <ShieldAlert size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong>Risk Disclosure:</strong> Unlisted and pre-IPO investments carry liquidity risks and do not guarantee an initial public offering (IPO) or returns. Always read the company information memoranda and consult your financial advisor before proceeding.
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
