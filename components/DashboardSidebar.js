import Link from "next/link"

const links = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/create", label: "Smart Post Composer" },
  { href: "/dashboard/media", label: "Video & Image Tools" },
  { href: "/dashboard/resources", label: "Free Resources" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/ai", label: "AI Research Assistant" },
  { href: "/dashboard/live", label: "Live Reporting" },
  { href: "/dashboard/calendar", label: "Content Calendar" },
  { href: "/dashboard/profile", label: "Profile & Settings" },
]

export default function DashboardSidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">🧠 DRN Dashboard</h2>
      <nav className="space-y-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block hover:text-blue-300">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
