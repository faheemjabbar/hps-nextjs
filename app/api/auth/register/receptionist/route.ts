import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"


export const receptionistSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),

  phone: z.string().min(11).optional(),
  shift: z.string().optional(), // Morning, Evening, Night
  desk: z.string().optional(),  // OPD, Front Desk, etc.
})


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = receptionistSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create User + Receptionist
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: "RECEPTIONIST",
        receptionist: {
          create: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            shift: data.shift,
            desk: data.desk,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Receptionist registered successfully",
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    )
  }
}
