import { z } from "zod"
import { Gender, BloodGroup } from "@prisma/client"

export const patientSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),

  phone: z.string().min(11).optional(),

  dob: z.coerce.date().optional(), // accepts string → Date
  gender: z.nativeEnum(Gender).optional(),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),

  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  medicalHistory: z.string().optional(),
})

export const doctorSchema = z.object({
  fullName: z.string().min(2),
  registrationId: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),

  phone: z.string().min(11).optional(),
  specialization: z.string(),
  qualification: z.string().optional(),

  experience: z.coerce
    .number()
    .int()
    .min(0)
    .max(50)
    .optional(),

  consultationFee: z.coerce
    .number()
    .int()
    .min(0)
    .optional(),

  gender: z.nativeEnum(Gender).optional(),

  isAvailable: z.boolean().optional(),
})

export const receptionistSchema = z.object({
  employeeId: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),

  phone: z.string().min(11).optional(),
  shift: z.string().optional(), // Morning, Evening, Night
  desk: z.string().optional(),  // OPD, Front Desk, etc.
})