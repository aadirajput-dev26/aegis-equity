"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, AlertCircle, RefreshCcw } from "lucide-react"
import { SkyVestLogo } from "@/components/ui/logo"

type AuthStep = "identifier" | "otp"
type AuthMode = "email" | "mobile"

export default function LoginPage() {
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
      if (!data.success) setError(data.message || "Something went wrong")
      else setStep("otp")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("")
      const newOtp = [...otp]
      digits.forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d })
      setOtp(newOtp)
      const nextIndex = Math.min(index + digits.length, 5)
      document.getElementById(`otp-${nextIndex}`)?.focus()
      return
    }
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus()
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError("")
    const otpValue = otp.join("")
    if (otpValue.length < 6) { setOtpError("Please enter the 6-digit OTP"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp: otpValue }),
      })
      const data = await res.json()
      if (!data.success) setOtpError(data.message || "Invalid OTP")
      else {
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
    <div className="auth-split">
      {/* LEFT PANEL */}
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
        <div style={{
          position: "absolute", top: -80, right: -80, width: 320, height: 320,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.07), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ marginBottom: "auto" }}>
          <SkyVestLogo variant="light" size="md" href="/" />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 60 }}>
          <div className="eyebrow-dark" style={{ marginBottom: 20 }}>Welcome Back</div>
          <h1 style={{
            fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
            fontWeight: 700, color: "#ffffff",
            letterSpacing: "-0.025em", lineHeight: 1.15,
            marginBottom: 20, maxWidth: 400,
          }}>
            Sign back into<br />
            <span style={{ color: "#38bdf8" }}>your portfolio.</span>
          </h1>
          <p style={{
            fontSize: "1rem", color: "rgba(199, 223, 232, 0.7)",
            lineHeight: 1.7, maxWidth: 380,
          }}>
            Access your private-market holdings, indicative valuations, and investment enquiries from where you left off.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
            {[
              { value: "8+", label: "Private companies" },
              { value: "₹17.8L+", label: "Indicative value" },
              { value: "100%", label: "KYC verified" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#38bdf8", letterSpacing: "-0.02em" }}>{value}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(199,223,232,0.5)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: "auto", paddingTop: 40,
          fontSize: "0.75rem", color: "rgba(199, 223, 232, 0.35)",
          lineHeight: 1.6, maxWidth: 380,
        }}>
          Values shown on the platform are indicative and for informational purposes only.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        background: "#ffffff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 40px", position: "relative",
        borderLeft: "1px solid var(--border)",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: 240, height: 240,
          background: "radial-gradient(circle at top right, rgba(56,189,248,0.06), transparent 60%)",
          pointerEvents: "none",
        }} />

        <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
          <div style={{ marginBottom: 40, display: "flex", justifyContent: "center" }} className="mobile-logo">
            <SkyVestLogo variant="dark" size="md" href="/" />
          </div>

          {step === "identifier" ? (
            <>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Sign In</div>
              <h2 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
                Welcome back
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", marginBottom: 32, lineHeight: 1.5 }}>
                Enter your {mode === "email" ? "email address" : "mobile number"} to continue.
              </p>

              <div className="segmented-control" style={{ marginBottom: 28 }}>
                <button className={`segmented-btn ${mode === "email" ? "active" : ""}`} onClick={() => { setMode("email"); setIdentifier(""); setError("") }}>Email</button>
                <button className={`segmented-btn ${mode === "mobile" ? "active" : ""}`} onClick={() => { setMode("mobile"); setIdentifier(""); setError("") }}>Mobile</button>
              </div>

              <form onSubmit={handleStart}>
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="login-identifier" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                    {mode === "email" ? "Email address" : "Mobile number"}
                  </label>
                  <input
                    id="login-identifier"
                    className="sv-input"
                    type={mode === "email" ? "email" : "tel"}
                    placeholder={mode === "email" ? "you@example.com" : "+91 98765 43210"}
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setError("") }}
                    autoComplete={mode === "email" ? "email" : "tel"}
                    required
                  />
                  {error && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--danger)", fontSize: "0.8125rem" }} role="alert">
                      <AlertCircle size={13} aria-hidden="true" />{error}
                    </div>
                  )}
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", height: 48 }} disabled={loading}>
                  {loading ? <><RefreshCcw size={15} style={{ animation: "spin 1s linear infinite" }} aria-hidden="true" /> Sending OTP...</> : <>Continue <ArrowRight size={16} aria-hidden="true" /></>}
                </button>
              </form>

              <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                New to SkyVest?{" "}
                <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>Create account</Link>
              </p>
            </>
          ) : (
            <>
              <button onClick={() => { setStep("identifier"); setOtp(["","","","","",""]); setOtpError("") }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 28, padding: 0, fontFamily: "inherit" }}>
                ← Back
              </button>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Verification</div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>Enter your OTP</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 32, lineHeight: 1.5 }}>
                We sent a 6-digit code to <strong style={{ color: "var(--text-secondary)" }}>{identifier}</strong>
              </p>
              <div style={{ padding: "10px 14px", background: "var(--blue-tint)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 28, fontSize: "0.8125rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600, color: "var(--primary)" }}>Demo:</span> Use OTP <span style={{ fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.1em" }}>123456</span>
              </div>
              <form onSubmit={handleVerify}>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }}>
                  {otp.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} className="otp-input" type="text" inputMode="numeric" maxLength={6}
                      value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      aria-label={`OTP digit ${i + 1}`} />
                  ))}
                </div>
                {otpError && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, color: "var(--danger)", fontSize: "0.8125rem", justifyContent: "center" }} role="alert"><AlertCircle size={13} aria-hidden="true" />{otpError}</div>}
                <button type="submit" className="btn-primary" style={{ width: "100%", height: 48 }} disabled={loading}>
                  {loading ? <><RefreshCcw size={15} style={{ animation: "spin 1s linear infinite" }} aria-hidden="true" /> Verifying...</> : <>Verify & Sign In <ArrowRight size={16} aria-hidden="true" /></>}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ position: "absolute", bottom: 20, fontSize: "0.6875rem", color: "var(--text-subtle)", textAlign: "center", maxWidth: 360, lineHeight: 1.5, padding: "0 20px" }}>
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
