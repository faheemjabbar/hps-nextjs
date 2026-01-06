import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateAppointmentSchema = z.object({
  appointmentDate: z.coerce.date().optional(),
  duration: z.number().int().optional(),
  reasonForVisit: z.string().optional(),
  notes: z.string().optional(),
  cancelledAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { select: { id: true, fullName: true, specialization: true } },
        patient: { select: { id: true, fullName: true } },
      },
    })
    if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    return NextResponse.json({ appointment }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch appointment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const data = updateAppointmentSchema.parse(body)

    const updated = await prisma.appointment.update({
      where: { id },
      data,
    })
    return NextResponse.json({ appointment: updated }, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || "Failed to update appointment" }, { status: 500 })
  }
}
