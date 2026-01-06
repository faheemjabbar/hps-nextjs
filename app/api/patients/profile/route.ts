import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Zod schema for updating patient profile
const updatePatientSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(11).optional(),
  dob: z.coerce.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  bloodGroup: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
  ]).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  medicalHistory: z.string().optional(),
  profileImage: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Assuming you get userId from headers / auth middleware
    const userId = request.headers.get("x-user-id")
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const patient = await prisma.patient.findUnique({
      where: { userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        dob: true,
        gender: true,
        bloodGroup: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        medicalHistory: true,
        profileImage: true,
      },
    })

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

    return NextResponse.json({ patient }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const data = updatePatientSchema.parse(body)

    const updatedPatient = await prisma.patient.update({
      where: { userId },
      data,
    })

    return NextResponse.json({ patient: updatedPatient }, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 })
  }
}
