import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        specialization: true,
        qualification: true,
        experience: true,
        consultationFee: true,
        gender: true,
        isAvailable: true,
      },
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({ doctor }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch doctor" },
      { status: 500 }
    )
  }
}
