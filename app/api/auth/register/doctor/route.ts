import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Gender } from "@prisma/client"
import bcrypt from 'bcryptjs'
import { z } from 'zod'


const doctorSchema = z.object({
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


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = doctorSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Check if registration ID already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { registrationId: data.registrationId },
    })

    if (existingDoctor) {
      return NextResponse.json(
        { error: 'Registration ID already in use' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user and Doctor profile
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            fullName: data.fullName,
            registrationId: data.registrationId,
            email: data.email,
            phone: data.phone,
            specialization: data.specialization,
            qualification: data.qualification,
            experience: data.experience,
            consultationFee: data.consultationFee ?? 0,
            gender: data.gender,
            isAvailable: data.isAvailable ?? true,
          },
        },
      },
    })


    return NextResponse.json(
      { message: 'Doctor registration submitted successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}