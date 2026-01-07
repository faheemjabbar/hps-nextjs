import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { receptionistSchema } from "@/lib/schemas"


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

    // Check if employeeId already exists
    const existingReceptionist = await prisma.receptionist.findUnique({
      where: { employeeId: data.employeeId },
    })

    if (existingReceptionist) {
      return NextResponse.json(
        { error: "Employee ID already registered" },
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
            employeeId: data.employeeId,
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
