"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { Building2, Mail, Lock, ChevronRight, Activity, ShieldCheck, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast'


// 1. Role-specific configurations
const roleConfigs = {
  patient: {
    label: "Email Address",
    placeholder: "john@example.com",
    icon: <Mail size={18} />,
    color: "text-blue-600",
  },
  doctor: {
    label: "Medical Registration ID / Email",
    placeholder: "DOC-12345 or doctor@hospital.com",
    icon: <ShieldCheck size={18} />,
    color: "text-emerald-600",
  },
  receptionist: {
    label: "Employee ID / Email",
    placeholder: "REC-98765 or staff@hospital.com",
    icon: <UserCircle size={18} />,
    color: "text-amber-600",
  },
};

type RoleType = keyof typeof roleConfigs;

export default function LoginPage() {
  const [role, setRole] = useState<RoleType>('patient');
  const router = useRouter()
  const [isLoading,setIsLoading] = useState(false)
  const [formData,setFormData] = useState({
    email:'',
    password:''
  })

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try{
      const result = await signIn('credentials',{
        email:formData.email,
        password:formData.password
    })
    if(result?.error){
      toast.error('Invalid email or password')
      return
    }



      const response = await fetch('/api/auth/session')
      const session = await response.json()


      if(session?.user?.role === 'RECEPTIONIST'){
        router.push('/receptionist/dashboard')
      }else if(session?.user?.role === 'DOCTOR'){
        router.push('/doctor/dashboard')
      }else if(session?.user?.role === 'PATIENT'){
        router.push('/patient/dashboard')
      }else{
        router.push('/')
      }
    }catch(error){
      toast.error('Login failed. Please try again.')
    }finally{
      setIsLoading(false)
    }
}
  
  // Get active config based on current role state
  const currentConfig = roleConfigs[role];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Main Card Container */}
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-slate-100">
        
        {/* LEFT SIDE: Medical Branding & Hero */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 p-12 text-white flex-col justify-between relative overflow-hidden">
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                <Building2 size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">City General HMS</h1>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold leading-[1.2]">
                Comprehensive <br />
                <span className="text-blue-200">Healthcare Management</span> <br />
                at Your Fingertips.
              </h2>
              <p className="text-blue-100 text-lg max-w-sm leading-relaxed">
                Log in to access your specialized portal, manage appointments, and ensure seamless patient care.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 py-4 px-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 inline-flex">
              <Activity className="text-blue-200 animate-bounce" />
              <div className="text-sm">
                <p className="font-bold">System Status: Secure</p>
                <p className="text-blue-200 text-xs">Verified HIPAA & GDPR Compliant</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-slate-800">Welcome Back</h3>
            <p className="text-slate-500 mt-2">Choose your role and enter credentials</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* ROLE SELECTOR TABS */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">Select Portal Access</label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl">
                {(Object.keys(roleConfigs) as RoleType[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2.5 text-xs font-bold capitalize rounded-lg transition-all duration-200 ${
                      role === r 
                        ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200/50' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC IDENTIFIER FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex justify-between">
                <span>{currentConfig.label}</span>
                <span className={`text-[10px] lowercase italic font-normal ${currentConfig.color}`}>
                   * Required for {role} portal
                </span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  {currentConfig.icon}
                </div>
                <input 
                  type="text" 
                  value={formData.email}
                  onChange={(e)=> setFormData({ ...formData,email:e.target.value})}
                  required
                  placeholder={currentConfig.placeholder}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" 
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e)=>setFormData({ ...formData,password:e.target.value})}
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" 
                />
              </div>
            </div>

            {/* OPTIONS: REMEMBER & FORGOT */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                <span className="group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 font-bold hover:text-blue-700 transition-colors underline-offset-4 ">
                Forgot password?
              </a>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
              Sign In 
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* FOOTER: REGISTER LINK */}
          <div className="mt-10 text-center text-sm text-slate-500 py-4">
            <p className='text-black text-md'>
              New to our hospital?{" "}
              <Link href="/register" className="text-blue-600 font-bold pl-1">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}