import React from "react";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Clock, 
  Settings, 
  BarChart3, 
  Users,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const SidebarItem = ({ icon: Icon, label, to }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${isActive 
        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 glow-primary" 
        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
      }
    `}
  >
    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    <span className="font-medium">{label}</span>
    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
  </NavLink>
);

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-800/50 bg-slate-900/20 backdrop-blur-xl p-6 hidden lg:flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center glow-primary">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Guardian</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Parental Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Overview" to="/parent/dashboard" />
          <SidebarItem icon={BarChart3} label="Activity" to="/parent/dashboard" />
          <SidebarItem icon={Clock} label="Time Limits" to="/limits" />
          <SidebarItem icon={Users} label="Child Profiles" to="/parent/dashboard" />
          <SidebarItem icon={Settings} label="Settings" to="/parent/dashboard" />
        </nav>

        <div className="glass-morphism p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Premium Active</span>
          </div>
          <p className="text-xs text-slate-400">All advanced protection features are currently enabled.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-slate-800/50 bg-slate-900/10 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search activity or settings..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">Alex Johnson</p>
                <p className="text-xs text-slate-500">Super Parent</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Alex+Johnson&background=random" alt="Avatar" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
