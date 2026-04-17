import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Cipher API - Cryptographic utilities for developers',
  description: 'Fast, secure cryptographic API with hashing, HMAC, JWT, password hashing, and encoding utilities. Perfect for security automation and integration.',
  keywords: ['crypto', 'api', 'hash', 'hmac', 'jwt', 'password', 'bcrypt', 'base64', 'security'],
  authors: [{ name: 'endpnt.dev' }],
  openGraph: {
    title: 'Cipher API - Cryptographic utilities for developers',
    description: 'Fast, secure cryptographic API with hashing, HMAC, JWT, and password utilities.',
    url: 'https://cipher.endpnt.dev',
    siteName: 'Cipher API',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cipher API - Cryptographic utilities for developers',
    description: 'Fast, secure cryptographic API with hashing, HMAC, JWT, and password utilities.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}