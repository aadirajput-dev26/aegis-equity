import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/topnav"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="dashboard-content" id="main-content">
        <TopNav title={title} subtitle={subtitle} />
        <div style={{ padding: "32px", maxWidth: 1280, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  )
}
