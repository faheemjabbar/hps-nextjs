import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { role: string } }
) {
  try {
    const { role } = params
    if (!role) return NextResponse.json({ error: "Role is required" }, { status: 400 })

    // Simulate getting userId from auth/session
    const userId = request.headers.get("x-user-id")
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    switch (role.toUpperCase()) {
      case "DOCTOR":
        const doctor = await prisma.doctor.findUnique({
          where: { userId },
          include: {
            appointments: {
              where: { status: { not: "CANCELLED" } },
              orderBy: { appointmentDate: "asc" },
            },
            reviews: true,
          },
        })
        if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
        return NextResponse.json({ dashboard: doctor }, { status: 200 })

      case "PATIENT":
        const patient = await prisma.patient.findUnique({
          where: { userId },
          include: {
            appointments: { orderBy: { appointmentDate: "desc" }, take: 10 },
            invoices: { orderBy: { createdAt: "desc" }, take: 5 },
          },
        })
        if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })
        return NextResponse.json({ dashboard: patient }, { status: 200 })

      case "RECEPTIONIST":
        const receptionist = await prisma.receptionist.findUnique({
          where: { userId },
          include: {
            user: true,
          },
        })
        if (!receptionist)
          return NextResponse.json({ error: "Receptionist not found" }, { status: 404 })
        return NextResponse.json({ dashboard: receptionist }, { status: 200 })

      case "ADMIN":
        const admin = await prisma.admin.findUnique({
          where: { userId },
          include: { user: true },
        })
        if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 })
        return NextResponse.json({ dashboard: admin }, { status: 200 })

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard" },
      { status: 500 }
    )
  }
}
