import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { Gender, BloodGroup } from "@prisma/client"
import { patientSchema } from "@/lib/schemas"



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = patientSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Check if email already exists
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

    // Create User + Patient
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: "PATIENT",
        patient: {
          create: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            dob: data.dob,
            gender: data.gender,
            bloodGroup: data.bloodGroup,
            address: data.address,
            emergencyContact: data.emergencyContact,
            emergencyPhone: data.emergencyPhone,
            medicalHistory: data.medicalHistory,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Patient registered successfully",
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