import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  cancelReason: z.string().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const data = updateStatusSchema.parse(body)

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: data.status,
        cancelReason: data.status === "CANCELLED" ? data.cancelReason : undefined,
        cancelledAt: data.status === "CANCELLED" ? new Date() : undefined,
        completedAt: data.status === "COMPLETED" ? new Date() : undefined,
      },
    })

    return NextResponse.json({ appointment: updated }, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 })
  }
}
