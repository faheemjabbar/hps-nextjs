import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch all doctors
    const doctors = await prisma.doctor.findMany({
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
        profileImage: true,
      },
      orderBy: { fullName: "asc" }, // optional: sort alphabetically
    })

    return NextResponse.json({ doctors }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch doctors" },
      { status: 500 }
    )
  }
}
