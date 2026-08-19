"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PieChart,
  Building2,
  Bookmark,
  FileText,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { SkyVestLogo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/enquiries", label: "Enquiries", icon: FileText },
  { href: "/kyc", label: "KYC & Verification", icon: ShieldCheck },
]

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
]

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <nav className="sidebar flex flex-col h-full" aria-label="Main navigation">
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px" }}>
        <SkyVestLogo variant="light" size="md" href="/dashboard" />
      </div>

      {/* Divider */}
      <div style={{ margin: "0 20px", height: 1, background: "rgba(255,255,255,0.07)" }} />

      {/* Main Nav */}
      <div style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
        <div
          className="micro-label"
          style={{ padding: "0 8px 10px", color: "rgba(199, 223, 232, 0.4)", letterSpacing: "0.1em" }}
        >
          Navigation
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn("sidebar-link", isActive && "active")}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={17} strokeWidth={isActive ? 2 : 1.6} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Bottom section */}
      <div style={{ padding: "12px 12px 0" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 12 }} />
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {bottomItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn("sidebar-link", isActive && "active")}
                  onClick={onNavigate}
                >
                  <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* User profile at bottom */}
      <div style={{ padding: "16px 12px 20px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 12 }} />
        <button
          className="sidebar-link"
          style={{ width: "100%", justifyContent: "space-between" }}
          aria-label="User menu"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0ea5e9, #22d3ee)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              AS
            </div>
            <div style={{ textAlign: "left", minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#e8f4fb",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 120,
                }}
              >
                Arjun Sharma
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(199,223,232,0.5)", lineHeight: 1.2 }}>Investor</div>
            </div>
          </div>
          <ChevronDown size={14} style={{ color: "rgba(199,223,232,0.4)", flexShrink: 0 }} aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
