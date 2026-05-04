import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const limitSchema = z.object({
  profileName: z.string().min(2, "Profile name must be at least 2 characters"),
  dailyLimit: z.number().min(1, "Limit must be at least 1 hour").max(24, "Limit cannot exceed 24 hours"),
  category: z.enum(["Entertainment", "Education", "Social Media", "Gaming"]),
  restrictionType: z.enum(["Soft", "Hard"]),
});

type LimitFormValues = z.infer<typeof limitSchema>;

const LimitForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LimitFormValues>({
    resolver: zodResolver(limitSchema),
    defaultValues: {
      dailyLimit: 2,
      category: "Gaming",
      restrictionType: "Soft"
    }
  });

  const onSubmit = async (data: LimitFormValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form Data:", data);
    toast.success("Time Limit Set!", {
      description: `Daily limit of ${data.dailyLimit}h set for ${data.profileName} in ${data.category}.`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    });
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-morphism p-8 rounded-2xl max-w-xl w-full"
    >
      <Link 
        to="/parent/dashboard" 
        className="flex items-center gap-1 text-slate-500 hover:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Set Usage Limit</h3>
          <p className="text-sm text-slate-400">Configure boundaries for your children</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Profile Name</label>
          <div className="relative">
            <input
              {...register("profileName")}
              type="text"
              placeholder="e.g. Leo's Laptop"
              className={`w-full bg-slate-900/50 border ${errors.profileName ? 'border-rose-500/50' : 'border-slate-800'} rounded-xl py-3 px-4 outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600`}
            />
            <AnimatePresence>
              {errors.profileName && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 mt-1 text-rose-400 text-xs font-medium"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.profileName.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Daily Limit */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Daily Limit (Hours)</label>
            <input
              {...register("dailyLimit", { valueAsNumber: true })}
              type="number"
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-indigo-500/50 transition-all text-white"
            />
            {errors.dailyLimit && (
              <p className="text-rose-400 text-xs mt-1">{errors.dailyLimit.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Category</label>
            <select
              {...register("category")}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-indigo-500/50 transition-all text-white"
            >
              <option value="Gaming">Gaming</option>
              <option value="Social Media">Social Media</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>

        {/* Restriction Type */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-300">Restriction Type</label>
          <div className="flex gap-4">
            {["Soft", "Hard"].map((type) => (
              <label key={type} className="flex-1 cursor-pointer group">
                <input
                  {...register("restrictionType")}
                  type="radio"
                  value={type}
                  className="sr-only"
                />
                <div className={`p-4 rounded-xl border-2 transition-all text-center ${
                  // Note: This is a simplified check since we don't have access to watch() easily here without more code
                  "border-slate-800 bg-slate-900/30 group-hover:border-slate-700"
                }`}>
                  <p className="text-sm font-bold text-white">{type} Lock</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                    {type === "Soft" ? "Notification Only" : "Instant Block"}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2`}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            "Activate Restriction"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default LimitForm;
