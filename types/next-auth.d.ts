import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and `session` callback
   */
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT"
      doctorId?: string
      patientId?: string
      receptionistId?: string
    } & DefaultSession["user"]
  }

  /**
   * User object returned by the JWT callback
   */
  interface User {
    id: string
    role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT"
    doctorId?: string
    patientId?: string
    receptionistId?: string
  }

  interface JWT {
    role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT"
    doctorId?: string
    patientId?: string
    receptionistId?: string
  }
}
