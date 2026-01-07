"use client";

import { MapPin } from "lucide-react";
import FormField from "./FormField";

export default function ReceptionistRegistration() {
  return (
    <>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Assigned Shift
        </label>
        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Shift</option>
          <option>Morning (8AM - 4PM)</option>
          <option>Evening (4PM - 12AM)</option>
          <option>Night (12AM - 8AM)</option>
        </select>
      </div>

      <FormField
        label="Assigned Desk"
        icon={<MapPin size={18} />}
        placeholder="Main Reception / Emergency"
      />
    </>
  );
}
