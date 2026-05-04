import React, { useState } from "react";
import { 
  Smartphone, 
  Gamepad2, 
  Globe, 
  Wifi, 
  ShieldAlert, 
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ActivityChart from "../components/dashboard/ActivityChart";
import ControlCard from "../components/dashboard/ControlCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { toast } from "sonner";

const ParentDashboard = () => {
  const [controls, setControls] = useState({
    internet: true,
    gaming: false,
    appInstall: true,
    safeSearch: true
  });

  const toggleControl = (key: keyof typeof controls) => {
    setControls(prev => {
      const newValue = !prev[key];
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} ${newValue ? 'Enabled' : 'Disabled'}`, {
        description: `Your child's device settings have been updated in real-time.`,
      });
      return { ...prev, [key]: newValue };
    });
  };

  const stats = [
    { label: "Screen Time", value: "4h 22m", icon: Clock, trend: "+12%", color: "text-indigo-400" },
    { label: "Blocked Threats", value: "12", icon: ShieldAlert, trend: "-5%", color: "text-emerald-400" },
    { label: "Active Sessions", value: "2", icon: Zap, trend: "Stable", color: "text-amber-400" },
    { label: "Usage Limit", value: "85%", icon: TrendingUp, trend: "High", color: "text-rose-400" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Family Overview</h2>
            <p className="text-slate-400 mt-1">Monitoring 2 devices for <b>Leo</b> and <b>Sophia</b>.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors">
              Export Report
            </button>
            <Link to="/limits" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center">
              Add Device
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Link
              to="/limits"
              key={stat.label}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-morphism p-6 rounded-2xl cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-slate-800/50 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full bg-slate-800/50 ${stat.trend.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-morphism p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Activity Trends</h3>
                <p className="text-sm text-slate-400">Weekly usage breakdown across categories</p>
              </div>
              <select className="bg-slate-800 border-none rounded-lg px-3 py-1 text-xs font-medium text-slate-300 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <ActivityChart />
          </div>

          {/* Device Status */}
          <div className="glass-morphism p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Connected Devices</h3>
            <div className="space-y-6">
              {[
                { name: "Leo's iPhone 15", status: "Online", battery: "84%", lastActive: "Just now" },
                { name: "Sophia's iPad Pro", status: "Idle", battery: "32%", lastActive: "15m ago" }
              ].map((device, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{device.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-400">{device.status}</span>
                      <span className="text-[10px] text-slate-500">|</span>
                      <span className="text-[10px] text-slate-400">Bat: {device.battery}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Zap className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-xl text-slate-500 hover:text-indigo-400 text-sm font-medium transition-all">
                + Link New Device
              </button>
            </div>
          </div>
        </div>

        {/* Controls Grid */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Permission Control</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ControlCard 
              icon={Globe} 
              title="Internet Access" 
              description="Global kill-switch for all connected family devices."
              status={controls.internet}
              onToggle={() => toggleControl('internet')}
              accentColor="indigo"
            />
            <ControlCard 
              icon={Gamepad2} 
              title="Gaming Mode" 
              description="Restrict access to high-bandwidth gaming platforms."
              status={controls.gaming}
              onToggle={() => toggleControl('gaming')}
              accentColor="amber"
            />
            <ControlCard 
              icon={Zap} 
              title="App Installs" 
              description="Require parent approval for all new app store downloads."
              status={controls.appInstall}
              onToggle={() => toggleControl('appInstall')}
              accentColor="emerald"
            />
            <ControlCard 
              icon={ShieldAlert} 
              title="Safe Search" 
              description="Enforce strict content filtering on all search engines."
              status={controls.safeSearch}
              onToggle={() => toggleControl('safeSearch')}
              accentColor="rose"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
