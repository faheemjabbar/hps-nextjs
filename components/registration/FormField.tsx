"use client";

export default function FormField({ label, icon, type = "text", placeholder = "", register }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-3.5 text-slate-400">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          {...register}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}
