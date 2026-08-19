"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Check, AlertCircle, RefreshCcw } from "lucide-react"
import { AegisEquityLogo } from "@/components/ui/logo"

type AuthStep = "identifier" | "otp"
type AuthMode = "email" | "mobile"

export default function SignupPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("email")
  const [step, setStep] = useState<AuthStep>("identifier")
  const [identifier, setIdentifier] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpError, setOtpError] = useState("")

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type: mode }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || "Something went wrong")
      } else {
        setStep("otp")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("")
      const newOtp = [...otp]
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d
      })
      setOtp(newOtp)
      const nextIndex = Math.min(index + digits.length, 5)
      document.getElementById(`otp-${nextIndex}`)?.focus()
      return
    }
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError("")
    const otpValue = otp.join("")
    if (otpValue.length < 6) {
      setOtpError("Please enter the 6-digit OTP")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp: otpValue }),
      })
      const data = await res.json()
      if (!data.success) {
        setOtpError(data.message || "Invalid OTP")
      } else {
        localStorage.setItem("sv_auth", JSON.stringify(data.data))
        router.push("/dashboard")
      }
    } catch {
      setOtpError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split" style={{ minHeight: "100vh" }}>
      {/* ═══ LEFT MARKETING PANEL ═══ */}
      <div
        className="auth-left-panel"
        style={{
          background: "radial-gradient(ellipse at top right, rgba(14, 165, 233, 0.18) 0%, transparent 55%), linear-gradient(160deg, #071a2b 0%, #0a2236 50%, #0d2638 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "40px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background orbs */}
        <div style={{
          position: "absolute", top: -80, right: -80, width: 320, height: 320,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.07), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 60, left: -60, width: 240, height: 240,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.05), transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ marginBottom: "auto" }}>
          <AegisEquityLogo variant="light" size="md" href="/" />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 60 }}>
          <div className="eyebrow-dark" style={{ marginBottom: 20 }}>
            Private Markets Platform
          </div>

          <h1 style={{
            fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            marginBottom: 24,
            maxWidth: 440,
          }}>
            Your private portfolio,<br />
            <span style={{ color: "#38bdf8" }}>in focus.</span>
          </h1>

          <p style={{
            fontSize: "1.0625rem",
            color: "rgba(199, 223, 232, 0.75)",
            lineHeight: 1.7,
            maxWidth: 420,
            marginBottom: 48,
          }}>
            Track your unlisted holdings, monitor indicative values, and manage investment enquiries from one secure workspace.
          </p>

          {/* Value propositions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { label: "Indicative portfolio values", desc: "Real-time indicative pricing on private companies" },
              { label: "Secure account access", desc: "OTP-based verification with encrypted storage" },
              { label: "Private investment workspace", desc: "Manage enquiries, watchlists, and documents" },
            ].map(({ label, desc }) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  <Check size={11} style={{ color: "#38bdf8" }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#e8f4fb", lineHeight: 1.3 }}>{label}</div>
                  <div style={{ fontSize: "0.8125rem", color: "rgba(199, 223, 232, 0.5)", lineHeight: 1.4, marginTop: 2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: "auto",
          paddingTop: 40,
          fontSize: "0.75rem",
          color: "rgba(199, 223, 232, 0.35)",
          lineHeight: 1.6,
          maxWidth: 380,
        }}>
          Values shown on the platform are indicative and for informational purposes only. Not an investment recommendation.
        </div>
      </div>

      {/* ═══ RIGHT AUTH PANEL ═══ */}
      <div style={{
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
        position: "relative",
        borderLeft: "1px solid var(--border)",
      }}>
        {/* Right panel subtle background */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: 240, height: 240,
          background: "radial-gradient(circle at top right, rgba(56,189,248,0.06), transparent 60%)",
          pointerEvents: "none",
        }} />

        <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
          {/* Mobile logo (hidden on desktop) */}
          <div style={{ marginBottom: 40, display: "flex", justifyContent: "center" }} className="mobile-logo">
            <AegisEquityLogo variant="dark" size="md" href="/" />
          </div>

          {step === "identifier" ? (
            <>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Get Started</div>
              <h2 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
                Create your account
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", marginBottom: 32, lineHeight: 1.5 }}>
                Enter your {mode === "email" ? "email address" : "mobile number"} to access your private investment workspace.
              </p>

              {/* Segmented Control */}
              <div className="segmented-control" style={{ marginBottom: 28 }} role="tablist" aria-label="Login method">
                <button
                  className={`segmented-btn ${mode === "email" ? "active" : ""}`}
                  onClick={() => { setMode("email"); setIdentifier(""); setError("") }}
                  role="tab"
                  aria-selected={mode === "email"}
                  id="tab-email"
                >
                  Email
                </button>
                <button
                  className={`segmented-btn ${mode === "mobile" ? "active" : ""}`}
                  onClick={() => { setMode("mobile"); setIdentifier(""); setError("") }}
                  role="tab"
                  aria-selected={mode === "mobile"}
                  id="tab-mobile"
                >
                  Mobile
                </button>
              </div>

              <form onSubmit={handleStart}>
                <div style={{ marginBottom: 20 }}>
                  <label
                    htmlFor="identifier"
                    style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}
                  >
                    {mode === "email" ? "Email address" : "Mobile number"}
                  </label>
                  <input
                    id="identifier"
                    className="sv-input"
                    type={mode === "email" ? "email" : "tel"}
                    placeholder={mode === "email" ? "you@example.com" : "+91 98765 43210"}
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setError("") }}
                    autoComplete={mode === "email" ? "email" : "tel"}
                    required
                    aria-describedby={error ? "identifier-error" : undefined}
                  />
                  {error && (
                    <div
                      id="identifier-error"
                      style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--danger)", fontSize: "0.8125rem" }}
                      role="alert"
                    >
                      <AlertCircle size={13} aria-hidden="true" />
                      {error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", height: 48, fontSize: "0.9375rem" }}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <RefreshCcw size={15} style={{ animation: "spin 1s linear infinite" }} aria-hidden="true" />
                      Sending OTP...
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      Continue
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  )}
                </button>
              </form>

              <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            /* OTP Step */
            <>
              <button
                onClick={() => { setStep("identifier"); setOtp(["","","","","",""]); setOtpError("") }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 28,
                  padding: 0, fontFamily: "inherit", fontWeight: 400,
                }}
                aria-label="Go back to previous step"
              >
                ← Back
              </button>

              <div className="eyebrow" style={{ marginBottom: 10 }}>Verification</div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
                Enter your OTP
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 32, lineHeight: 1.5 }}>
                We sent a 6-digit code to{" "}
                <strong style={{ color: "var(--text-secondary)" }}>{identifier}</strong>
              </p>

              {/* Hint */}
              <div style={{
                padding: "10px 14px",
                background: "var(--blue-tint)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                marginBottom: 28,
                fontSize: "0.8125rem",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span style={{ fontWeight: 600, color: "var(--primary)" }}>Demo:</span>
                Use OTP <span style={{ fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.1em" }}>123456</span>
              </div>

              <form onSubmit={handleVerify}>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }} role="group" aria-label="OTP input">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      className="otp-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>

                {otpError && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, color: "var(--danger)", fontSize: "0.8125rem", justifyContent: "center" }}
                    role="alert"
                  >
                    <AlertCircle size={13} aria-hidden="true" />
                    {otpError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", height: 48 }}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <RefreshCcw size={15} style={{ animation: "spin 1s linear infinite" }} aria-hidden="true" />
                      Verifying...
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      Verify & Continue
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  )}
                </button>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Didn&apos;t receive it?{" "}
                  <button
                    type="button"
                    onClick={() => handleStart(new Event("click") as unknown as React.FormEvent)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontWeight: 500, fontFamily: "inherit", fontSize: "inherit" }}
                  >
                    Resend OTP
                  </button>
                </p>
              </form>
            </>
          )}
        </div>

        {/* Disclaimer */}
        <p style={{
          position: "absolute", bottom: 20,
          fontSize: "0.6875rem",
          color: "var(--text-subtle)",
          textAlign: "center",
          maxWidth: 360,
          lineHeight: 1.5,
          padding: "0 20px",
        }}>
          SkyVest is a private-market enquiry platform. Indicative values are for informational purposes only.
        </p>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (min-width: 769px) { .mobile-logo { display: none !important; } }
        `}</style>
      </div>
    </div>
  )
}
