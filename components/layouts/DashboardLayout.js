export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🧭 Top Header */}
      <header className="w-full bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
        <h1 className="text-lg font-bold text-blue-700">DRN Newsroom</h1>
        <nav className="space-x-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Posts</a>
          <a href="#" className="hover:text-blue-600">Earnings</a>
          <a href="#" className="hover:text-blue-600">Notifications</a>
          <a href="#" className="hover:text-blue-600">Settings</a>
        </nav>
      </header>

      {/* 🖥️ Content Area */}
      <div className="flex flex-1">
        {/* Sidebar will come from the page layout */}
        {children}
      </div>
    </div>
  )
}
