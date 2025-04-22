import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 bg-slate-50 p-6 overflow-y-auto">
        {/* 🚧 Dev Mode Banner */}
        <div className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg mb-4 font-semibold shadow">
          ⚠️ Development Mode: Auth is temporarily disabled
        </div>
        {children}
      </main>
    </div>
  );
}

