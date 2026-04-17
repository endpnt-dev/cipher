import Link from 'next/link'
import { Shield, Github } from 'lucide-react'

export default function Header() {
  return (
    <nav className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary-600" />
          <span className="text-xl font-mono font-bold">Cipher API</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="text-sm hover:text-primary-600 transition-colors">
            Docs
          </Link>
          <Link href="/pricing" className="text-sm hover:text-primary-600 transition-colors">
            Pricing
          </Link>
          <Link
            href="https://github.com/endpnt-dev/cipher"
            className="text-sm hover:text-primary-600 transition-colors flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
        </div>
      </div>
    </nav>
  )
}