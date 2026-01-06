import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Outfit, Prata } from 'next/font/google'

// Load Outfit (global body font)
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  variable: '--font-outfit',
})

// Load Prata (for headings or special text)
const prata = Prata({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-prata',
})

export const metadata: Metadata = {
  title: 'Revive - Volunteer & Disaster Relief Platform',
  description: 'Connect volunteers with NGOs for disaster relief campaigns',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${prata.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
