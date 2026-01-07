"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorSchema, patientSchema, receptionistSchema } from "@/lib/schemas";
import toast from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Briefcase,
  Clock,
  MapPin,
} from "lucide-react";

type Role = "patient" | "doctor" | "receptionist";
type FormData = any; // Union of all schema types

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("patient");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getSchema = () => {
    switch (role) {
      case "doctor": return doctorSchema;
      case "patient": return patientSchema;
      case "receptionist": return receptionistSchema;
      default: return doctorSchema;
    }
  };

  const {
    register,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(getSchema()),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let endpoint = "";
      if (role === "doctor") endpoint = "/api/auth/register/doctor";
      else if (role === "patient") endpoint = "/api/auth/register/patient";
      else if (role === "receptionist") endpoint = "/api/auth/register/receptionist";

      if (!endpoint) return;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Successfully Registered!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Area */}
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold">Create HMS Account</h1>
          <p className="text-blue-100 mt-2">
            Join our healthcare network as a {role}.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex border-b border-slate-100">
          {(["patient", "doctor", "receptionist"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${
                role === r
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form
          key={role}
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 md:p-10 space-y-6"
        >
          {/* Section 1: Core Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              icon={<User size={18} />}
              placeholder="John Doe"
              register={register("fullName")}
            />
            <FormField
              label="Email Address"
              icon={<Mail size={18} />}
              type="email"
              placeholder="john@hospital.com"
              register={register("email")}
            />
            <FormField
              label="Password"
              icon={<Lock size={18} />}
              type="password"
              placeholder="••••••••"
              register={register("password")}
            />
            <FormField
              label="Phone Number"
              icon={<Phone size={18} />}
              placeholder="+1 (555) 000-0000"
              register={register("phone")}
            />
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Role-Specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* PATIENT */}
            {role === "patient" && (
              <>
                <FormField
                  label="Date of Birth"
                  icon={<Calendar size={18} />}
                  type="date"
                  register={register("dob")}
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Blood Group
                  </label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" {...register("bloodGroup")}>
                    <option value="A_POSITIVE">A+</option>
                    <option value="O_POSITIVE">O+</option>
                    <option value="B_POSITIVE">B+</option>
                    <option value="AB_POSITIVE">AB+</option>
                    <option value="A_NEGATIVE">A-</option>
                    <option value="O_NEGATIVE">O-</option>
                    <option value="B_NEGATIVE">B-</option>
                    <option value="AB_NEGATIVE">AB-</option>
                  </select>
                </div>
                <FormField
                  label="Emergency Contact Name"
                  icon={<ShieldCheck size={18} />}
                  placeholder="Jane Doe"
                  register={register("emergencyContact")}
                />
                <FormField
                  label="Emergency Phone"
                  icon={<Phone size={18} />}
                  placeholder="+1 (555) 000-0000"
                  register={register("emergencyPhone")}
                />
                <div className="md:col-span-2">
                  <FormField
                    label="Home Address"
                    icon={<MapPin size={18} />}
                    placeholder="123 Medical Way, NY"
                    register={register("address")}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Medical History
                  </label>
                  <textarea
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-24 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List allergies or chronic conditions..."
                    {...register("medicalHistory")}
                  />
                </div>
              </>
            )}

            {/* DOCTOR */}
            {role === "doctor" && (
              <>
                <FormField
                  label="Medical Registration ID"
                  icon={<ShieldCheck size={18} />}
                  placeholder="MC-12345"
                  register={register("registrationId")}
                />
                <FormField
                  label="Specialization"
                  icon={<Stethoscope size={18} />}
                  placeholder="Cardiologist"
                  register={register("specialization")}
                />
                <FormField
                  label="Qualification"
                  icon={<Briefcase size={18} />}
                  placeholder="MD, FACS"
                  register={register("qualification")}
                />
                <FormField
                  label="Experience (Years)"
                  icon={<Clock size={18} />}
                  type="number"
                  placeholder="5"
                  register={register("experience", { valueAsNumber: true })}
                />
                <FormField
                  label="Consultation Fee ($)"
                  icon={<HeartPulse size={18} />}
                  type="number"
                  placeholder="100"
                  register={register("consultationFee", {
                    valueAsNumber: true,
                  })}
                />
              </>
            )}

            {/* RECEPTIONIST */}
            {role === "receptionist" && (
              <>
                <FormField
                  label="Employee ID"
                  icon={<ShieldCheck size={18} />}
                  placeholder="EMP-12345"
                  register={register("employeeId")}
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Assigned Shift
                  </label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" {...register("shift")}>
                    <option>Morning (8AM - 4PM)</option>
                    <option>Evening (4PM - 12AM)</option>
                    <option>Night (12AM - 8AM)</option>
                  </select>
                </div>
                <FormField
                  label="Assigned Desk"
                  icon={<MapPin size={18} />}
                  placeholder="Main Reception / Emergency"
                  register={register("desk")}
                />
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Complete Registration"}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

/* Helper Component */
function FormField({
  label,
  icon,
  type = "text",
  placeholder = "",
  register,
}: any) {
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
