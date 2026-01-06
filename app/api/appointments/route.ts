import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createAppointmentSchema = z.object({
  doctorId: z.string().min(1),
  patientId: z.string().min(1),
  appointmentDate: z.coerce.date(),
  duration: z.number().int().optional().default(30),
  reasonForVisit: z.string().optional(),
})

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { appointmentDate: "asc" },
      include: {
        doctor: { select: { id: true, fullName: true, specialization: true } },
        patient: { select: { id: true, fullName: true } },
      },
    })
    return NextResponse.json({ appointments }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createAppointmentSchema.parse(body)

    // Optional: Check if doctor exists
    const doctor = await prisma.doctor.findUnique({ where: { id: data.doctorId } })
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 })

    // Optional: Check if patient exists
    const patient = await prisma.patient.findUnique({ where: { id: data.patientId } })
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

    const appointment = await prisma.appointment.create({ data })
    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || "Failed to create appointment" }, { status: 500 })
  }
}
