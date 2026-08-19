"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
}

export function AegisEquityLogo({ variant = "dark", size = "md", href = "/", className }: LogoProps) {
  const sizes = {
    sm: { mark: 28, fontSize: "1rem", gap: 8 },
    md: { mark: 34, fontSize: "1.2rem", gap: 10 },
    lg: { mark: 42, fontSize: "1.5rem", gap: 12 },
  }

  const s = sizes[size]
  const isDark = variant === "dark"

  const logoEl = (
    <div
      className={cn("flex items-center", className)}
      style={{ gap: s.gap }}
      aria-label="Aegis Equity"
    >
      {/* Geometric logo mark */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer circle */}
        <circle cx="17" cy="17" r="16.5" stroke={isDark ? "#0ea5e9" : "#38bdf8"} strokeWidth="1" opacity="0.4" />
        {/* Inner filled circle */}
        <circle cx="17" cy="17" r="13" fill={isDark ? "#071a2b" : "#0ea5e9"} />
        {/* Upward "S" abstraction - stylised arrow/path */}
        <path
          d="M12 21.5 C12 19.5, 14 18, 17 18 C20 18, 22 16.5, 22 14.5 C22 12.5, 20 11, 17 11"
          stroke={isDark ? "#38bdf8" : "#ffffff"}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Small upward tick */}
        <path
          d="M14.5 13.5 L17 11 L19.5 13.5"
          stroke={isDark ? "#38bdf8" : "#ffffff"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Wordmark */}
      <div style={{ lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: s.fontSize,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: isDark ? "#102a43" : "#ffffff",
          }}
        >
          Aegis
        </span>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: s.fontSize,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: isDark ? "#0ea5e9" : "#38bdf8",
          }}
        >
          Equity
        </span>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {logoEl}
      </Link>
    )
  }

  return logoEl
}
