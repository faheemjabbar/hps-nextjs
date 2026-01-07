"use client";

import { Calendar, ShieldCheck, Phone, MapPin } from "lucide-react";
import FormField from "./FormField";

export default function PatientRegistration() {
  return (
    <>
      <FormField
        label="Date of Birth"
        icon={<Calendar size={18} />}
        type="date"
      />

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Blood Group
        </label>
        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Blood Group</option>
          <option>A+</option><option>O+</option><option>B+</option><option>AB+</option>
          <option>A-</option><option>O-</option><option>B-</option><option>AB-</option>
        </select>
      </div>

      <FormField
        label="Emergency Contact Name"
        icon={<ShieldCheck size={18} />}
        placeholder="Jane Doe"
      />

      <FormField
        label="Emergency Phone"
        icon={<Phone size={18} />}
        placeholder="+1 (555) 000-0000"
      />

      <div className="md:col-span-2">
        <FormField
          label="Home Address"
          icon={<MapPin size={18} />}
          placeholder="123 Medical Way, NY"
        />
      </div>

      <div className="md:col-span-2 space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Medical History
        </label>
        <textarea
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-24 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder:text-slate-300"
          placeholder="List allergies or chronic conditions..."
        />
      </div>
    </>
  );
}
