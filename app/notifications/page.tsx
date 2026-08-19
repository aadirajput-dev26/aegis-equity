"use client"

import { useState } from "react"
import { Bell, Check, TrendingUp, ShieldCheck, FileText, Trash2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface NotifItem {
  id: string
  title: string
  description: string
  time: string
  type: "enquiry" | "price" | "kyc" | "system"
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotifItem[]>([
    {
      id: "n1",
      title: "Enquiry Status Updated",
      description: "Your buy enquiry for Tata Capital (250 shares) has been approved by the dealer desk.",
      time: "2 hours ago",
      type: "enquiry",
      read: false,
    },
    {
      id: "n2",
      title: "Indicative Price Movement",
      description: "NSE India indicative valuation updated to ₹1,998 (+4.06%).",
      time: "Yesterday, 4:15 PM",
      type: "price",
      read: false,
    },
    {
      id: "n3",
      title: "KYC Verification Complete",
      description: "Your Aadhaar and PAN documents have been successfully verified.",
      time: "3 days ago",
      type: "kyc",
      read: true,
    },
    {
      id: "n4",
      title: "Portfolio Summary Available",
      description: "Monthly indicative portfolio performance statement for July 2026 is ready.",
      time: "1 week ago",
      type: "system",
      read: true,
    },
  ])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getIcon = (type: NotifItem["type"]) => {
    switch (type) {
      case "enquiry":
        return <FileText size={16} style={{ color: "var(--primary)" }} />
      case "price":
        return <TrendingUp size={16} style={{ color: "var(--success)" }} />
      case "kyc":
        return <ShieldCheck size={16} style={{ color: "#8b5cf6" }} />
      default:
        return <Bell size={16} style={{ color: "var(--text-muted)" }} />
    }
  }

  return (
    <DashboardLayout title="Notifications" subtitle="Recent account alerts and market movements">
      <div className="animate-fade-in" style={{ maxWidth: 720 }}>
        {/* Header Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {notifications.filter((n) => !n.read).length} unread alerts
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {notifications.length > 0 && (
              <>
                <button
                  className="btn-secondary"
                  style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                  onClick={markAllRead}
                >
                  <Check size={13} /> Mark all as read
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: "0.8rem", padding: "6px 12px", color: "var(--danger)", borderColor: "rgba(217,92,92,0.3)" }}
                  onClick={clearAll}
                >
                  <Trash2 size={13} /> Clear
                </button>
              </>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="sv-card" style={{ padding: "60px 20px", textAlign: "center" }}>
            <Bell size={32} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: 4 }}>No notifications</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>You are all caught up!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className="sv-card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  background: n.read ? "white" : "var(--blue-tint)",
                  borderColor: n.read ? "var(--border)" : "var(--primary)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "white",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {getIcon(n.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{n.title}</div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    {n.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
