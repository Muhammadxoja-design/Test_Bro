import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ControlCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: boolean;
  onToggle: () => void;
  accentColor?: string;
}

const ControlCard: React.FC<ControlCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  status, 
  onToggle,
  accentColor = "indigo"
}) => {
  const accentClasses = {
    indigo: "text-indigo-400 bg-indigo-500/10 glow-primary",
    emerald: "text-emerald-400 bg-emerald-500/10 glow-success",
    amber: "text-amber-400 bg-amber-500/10 glow-amber",
    rose: "text-rose-400 bg-rose-500/10"
  };

  const toggleClasses = {
    indigo: "bg-indigo-600 shadow-indigo-600/50",
    emerald: "bg-emerald-600 shadow-emerald-600/50",
    amber: "bg-amber-600 shadow-amber-600/50",
    rose: "bg-rose-600 shadow-rose-600/50"
  };

  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-morphism p-6 rounded-2xl flex flex-col justify-between group transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${accentClasses[accentColor as keyof typeof accentClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <button 
          onClick={onToggle}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${status ? toggleClasses[accentColor as keyof typeof toggleClasses] : 'bg-slate-800'}`}
        >
          <motion.div 
            animate={{ x: status ? 24 : 4 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
          />
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {status ? 'Active' : 'Disabled'}
        </span>
      </div>
    </motion.div>
  );
};

export default ControlCard;
