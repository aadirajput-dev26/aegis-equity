"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, X } from "lucide-react"
import { AegisEquityLogo } from "@/components/ui/logo"
import { Sidebar } from "@/components/layout/sidebar"

interface TopNavProps {
  title?: string
  subtitle?: string
}

export function TopNav({ title, subtitle }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Main topbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(247, 252, 255, 0.92)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Left: Mobile menu + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-primary)",
            }}
            className="mobile-menu-btn"
          >
            <Menu size={18} aria-hidden="true" />
          </button>

          {title && (
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                  margin: 0,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Market status pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: "99px",
              background: "var(--blue-tint)",
              border: "1px solid var(--border)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontWeight: 500,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
            className="status-pill"
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--success)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Updated 8 min ago
          </div>

          {/* Notifications */}
          <Link
            href="/notifications"
            aria-label="Notifications"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "white",
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "all 150ms ease",
            }}
          >
            <Bell size={16} aria-hidden="true" />
          </Link>

          {/* Avatar */}
          <Link
            href="/settings"
            aria-label="Profile and settings"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            AS
          </Link>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(7, 26, 43, 0.5)",
              backdropFilter: "blur(2px)",
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: "relative",
              width: 260,
              height: "100%",
              overflowY: "auto",
              zIndex: 51,
            }}
          >
            <div style={{ position: "absolute", top: 12, right: 12, zIndex: 52 }}>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                }}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-btn { display: flex !important; }
          .status-pill { display: none !important; }
        }
        @media (max-width: 640px) {
          header { padding: 0 16px !important; }
        }
      `}</style>
    </>
  )
}
