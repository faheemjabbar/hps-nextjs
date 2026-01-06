import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Helper: Generate all time slots between startTime and endTime
function generateSlots(start: string, end: string, duration: number) {
  const slots: string[] = []
  let [startH, startM] = start.split(":").map(Number)
  const [endH, endM] = end.split(":").map(Number)

  while (startH < endH || (startH === endH && startM < endM)) {
    const hourStr = startH.toString().padStart(2, "0")
    const minStr = startM.toString().padStart(2, "0")
    slots.push(`${hourStr}:${minStr}`)

    startM += duration
    if (startM >= 60) {
      startH += 1
      startM -= 60
    }
  }

  return slots
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) return NextResponse.json({ error: "Doctor ID required" }, { status: 400 })

    // Parse optional query param for date (YYYY-MM-DD)
    const url = new URL(request.url)
    const dateStr = url.searchParams.get("date") // e.g., "2026-01-07"
    if (!dateStr) return NextResponse.json({ error: "date query required (YYYY-MM-DD)" }, { status: 400 })
    const date = new Date(dateStr)

    // Get doctor's active availability
    const availabilities = await prisma.doctorAvailability.findMany({
      where: {
        doctorId: id,
        isActive: true,
      },
    })

    if (!availabilities.length) {
      return NextResponse.json({ slots: [] })
    }

    // Get all appointments for that doctor on the given date
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: {
          gte: new Date(dateStr + "T00:00:00"),
          lte: new Date(dateStr + "T23:59:59"),
        },
        status: { not: "CANCELLED" }, // ignore cancelled slots
      },
      select: { appointmentDate: true },
    })

    const bookedTimes = appointments.map((a) =>
      a.appointmentDate.toISOString().slice(11, 16) // "HH:MM"
    )

    // Generate available slots per availability and remove booked times
    let slots: string[] = []
    availabilities.forEach((av) => {
      const daySlots = generateSlots(av.startTime, av.endTime, av.slotDuration)
      const freeSlots = daySlots.filter((s) => !bookedTimes.includes(s))
      slots = slots.concat(freeSlots)
    })

    return NextResponse.json({ slots }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch slots" }, { status: 500 })
  }
}
