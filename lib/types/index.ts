// ============================================================
// SkyVest — Core TypeScript Types
// ============================================================

export type Company = {
  id: string
  name: string
  slug: string
  sector: string
  category: string
  status: "unlisted" | "pre-ipo"
  indicativePrice: number
  previousPrice: number
  priceChange: number
  priceChangePercent: number
  lastUpdated: string
  description: string
  founded: string
  headquarters: string
  employees: string
  revenue: string
  valuation: string
  promoters: string
  isin?: string
  logoInitials: string
  logoColor: string
}

export type Holding = {
  id: string
  companyId: string
  companyName: string
  companySector: string
  companyCategory: string
  companyStatus: "unlisted" | "pre-ipo"
  quantity: number
  averageCost: number
  indicativePrice: number
  currentValue: number
  investedValue: number
  gain: number
  gainPercent: number
  lastUpdated: string
}

export type Enquiry = {
  id: string
  companyId: string
  companyName: string
  type: "buy" | "sell"
  quantity: number
  indicativePrice: number
  totalValue: number
  status: "pending" | "under-review" | "completed" | "cancelled"
  notes?: string
  createdAt: string
  updatedAt: string
}

export type WatchlistItem = {
  id: string
  companyId: string
  companyName: string
  sector: string
  category: string
  status: "unlisted" | "pre-ipo"
  indicativePrice: number
  previousPrice: number
  priceChange: number
  priceChangePercent: number
  lastUpdated: string
  addedAt: string
}

export type Portfolio = {
  totalValue: number
  investedValue: number
  unrealisedGain: number
  unrealisedGainPercent: number
  holdingsCount: number
  lastUpdated: string
}

export type PortfolioPerformancePoint = {
  date: string
  value: number
}

export type AllocationItem = {
  sector: string
  value: number
  percent: number
  color: string
}

export type KYCStatus = "not-started" | "in-progress" | "pending-review" | "verified" | "rejected"

export type KYCSection = {
  id: string
  label: string
  status: KYCStatus
  completedAt?: string
  details?: string
}

export type KYC = {
  overallStatus: KYCStatus
  sections: KYCSection[]
  lastUpdated: string
}

export type Profile = {
  id: string
  name: string
  email: string
  mobile: string
  pan?: string
  dob?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  avatarInitials: string
  accountCreated: string
  notifications: {
    email: boolean
    sms: boolean
    enquiryUpdates: boolean
    priceAlerts: boolean
    kycUpdates: boolean
  }
}

export type AuthStartPayload = {
  identifier: string
  type: "email" | "mobile"
}

export type AuthVerifyPayload = {
  identifier: string
  otp: string
}

export type EnquiryCreatePayload = {
  companyId: string
  type: "buy" | "sell"
  quantity: number
  indicativePrice: number
  notes?: string
}

export type ApiResponse<T> = {
  data: T
  success: boolean
  message?: string
}
