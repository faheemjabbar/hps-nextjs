import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'RECEPTIONIST') {
    redirect('/')
  }

  return (
    <div>
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-xl font-bold">Receptionist Portal</h1>
      </header>
      <main>{children}</main>
    </div>
  )
}