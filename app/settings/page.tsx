"use client"

import { useEffect, useState } from "react"
import { User, Bell, Shield, Sliders, Check, RefreshCcw } from "lucide-react"
import type { Profile } from "@/lib/types"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { formatDate } from "@/lib/utils"

type TabKey = "personal" | "notifications" | "security" | "preferences"

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("personal")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    pan: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [notifs, setNotifs] = useState({
    email: true,
    sms: true,
    enquiryUpdates: true,
    priceAlerts: false,
    kycUpdates: true,
  })

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setProfile(d.data)
          setFormData({
            name: d.data.name || "",
            email: d.data.email || "",
            mobile: d.data.mobile || "",
            pan: d.data.pan || "",
            address: d.data.address || "",
            city: d.data.city || "",
            state: d.data.state || "",
            pincode: d.data.pincode || "",
          })
          if (d.data.notifications) {
            setNotifs(d.data.notifications)
          }
        }
        setLoading(false)
      })
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedSuccess(false)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, notifications: notifs }),
      })
      const d = await res.json()
      if (d.success) {
        setProfile(d.data)
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      }
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <DashboardLayout title="Settings" subtitle="Manage your profile and platform preferences">
      <div className="animate-fade-in" style={{ maxWidth: 800 }}>
        {/* Profile Card Header */}
        <div className="sv-card" style={{ padding: "24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0ea5e9, #22d3ee)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              {profile?.avatarInitials || "AS"}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                  {profile?.name || "Arjun Sharma"}
                </h1>
                <span className="badge badge-sky">Verified Investor</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>{profile?.email || "arjun.sharma@example.com"}</span>
                <span>•</span>
                <span>{profile?.mobile || "+91 98765 43210"}</span>
                <span>•</span>
                <span>Joined {profile ? formatDate(profile.accountCreated) : "June 2026"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 24,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 2,
            overflowX: "auto",
          }}
          role="tablist"
        >
          {[
            { id: "personal" as TabKey, label: "Personal Info", icon: User },
            { id: "notifications" as TabKey, label: "Notifications", icon: Bell },
            { id: "security" as TabKey, label: "Security", icon: Shield },
            { id: "preferences" as TabKey, label: "Preferences", icon: Sliders },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: "8px 8px 0 0",
                borderBottom: activeTab === id ? "2px solid var(--primary)" : "2px solid transparent",
                color: activeTab === id ? "var(--primary)" : "var(--text-muted)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.875rem",
                fontWeight: activeTab === id ? 600 : 400,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "all 150ms ease",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="sv-card" style={{ padding: 32 }}>
            <div className="skeleton" style={{ height: 20, width: "40%", marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 40, width: "100%", marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 40, width: "100%", marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 40, width: "60%" }} />
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit}>
            {activeTab === "personal" && (
              <div className="sv-card" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: 20 }}>
                  Personal Information
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                  <div>
                    <label htmlFor="settings-name" className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      Full Name
                    </label>
                    <input
                      id="settings-name"
                      className="sv-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="settings-pan" className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      PAN Card Number
                    </label>
                    <input
                      id="settings-pan"
                      className="sv-input"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                  <div>
                    <label htmlFor="settings-email" className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      Email Address
                    </label>
                    <input
                      id="settings-email"
                      type="email"
                      className="sv-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="settings-mobile" className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      Mobile Number
                    </label>
                    <input
                      id="settings-mobile"
                      className="sv-input"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="settings-address" className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                    Permanent Address
                  </label>
                  <input
                    id="settings-address"
                    className="sv-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
                  <div>
                    <label htmlFor="settings-city" className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      City
                    </label>
                    <input
                      id="settings-city"
                      className="sv-input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="settings-state" className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      State
                    </label>
                    <input
                      id="settings-state"
                      className="sv-input"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="settings-pin" className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      Pincode
                    </label>
                    <input
                      id="settings-pin"
                      className="sv-input"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                  {savedSuccess && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--success)", fontSize: "0.875rem", fontWeight: 500 }}>
                      <Check size={16} /> Changes saved successfully
                    </div>
                  )}
                  <div style={{ marginLeft: "auto" }}>
                    <button type="submit" className="btn-primary" disabled={saving} aria-busy={saving}>
                      {saving ? (
                        <>
                          <RefreshCcw size={14} style={{ animation: "spin 1s linear infinite" }} />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="sv-card" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: 8 }}>
                  Notification Preferences
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 24 }}>
                  Choose how and when you receive updates regarding your holdings and enquiries.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                  {[
                    { key: "email" as const, title: "Email Notifications", desc: "Receive summary digests, statements, and alerts via email." },
                    { key: "sms" as const, title: "SMS Alerts", desc: "Instant text messages for urgent transaction updates and OTP logins." },
                    { key: "enquiryUpdates" as const, title: "Enquiry Status Updates", desc: "Get notified when dealers review or approve buy/sell requests." },
                    { key: "priceAlerts" as const, title: "Indicative Valuation Movements", desc: "Receive alerts when watched companies update indicative prices." },
                    { key: "kycUpdates" as const, title: "Compliance & KYC Reminders", desc: "Important notices about annual verification and regulatory requirements." },
                  ].map(({ key, title, desc }) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 18px",
                        background: "var(--muted)",
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{title}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifs[key]}
                        onChange={() => toggleNotif(key)}
                        style={{
                          width: 20,
                          height: 20,
                          accentColor: "var(--primary)",
                          cursor: "pointer",
                          borderRadius: 4,
                        }}
                        aria-label={title}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="sv-card" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: 8 }}>
                  Security & Authentication
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 24 }}>
                  SkyVest uses passwordless OTP verification to ensure banking-grade security for your account.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ padding: "16px 20px", background: "var(--blue-tint)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Two-Factor Authentication (2FA)</div>
                      <span className="badge badge-success">Active (OTP)</span>
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      Every login requires a one-time passcode delivered to your verified mobile number or registered email.
                    </div>
                  </div>

                  <div style={{ padding: "16px 20px", background: "var(--muted)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: 4 }}>Active Sessions</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: 12 }}>
                      Currently active on this device: Chrome on Windows • Mumbai, India (Current)
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: "0.8125rem", padding: "6px 14px" }}
                      onClick={() => {
                        localStorage.removeItem("sv_auth")
                        window.location.href = "/login"
                      }}
                    >
                      Sign Out All Other Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="sv-card" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: 8 }}>
                  Platform Preferences
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 24 }}>
                  Configure your display and currency units.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
                  <div>
                    <label className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      Default Currency
                    </label>
                    <select className="sv-input" defaultValue="INR" disabled style={{ cursor: "not-allowed", opacity: 0.8 }}>
                      <option value="INR">Indian Rupee (INR - ₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="micro-label" style={{ display: "block", marginBottom: 6 }}>
                      Number Format
                    </label>
                    <select className="sv-input" defaultValue="lakhs">
                      <option value="lakhs">Indian (Lakhs & Crores)</option>
                      <option value="millions">International (Millions & Billions)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                  <button type="button" className="btn-primary" onClick={() => setSavedSuccess(true)}>
                    Apply Preferences
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}
