import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-600" />
              <span className="font-mono font-bold">Cipher API</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fast, secure cryptographic utilities for developers.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Product</h4>
            <div className="space-y-2">
              <Link href="/docs" className="block text-sm text-muted-foreground hover:text-foreground">
                Documentation
              </Link>
              <Link href="/pricing" className="block text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link href="/api/v1/health" className="block text-sm text-muted-foreground hover:text-foreground">
                Status
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Resources</h4>
            <div className="space-y-2">
              <Link href="https://github.com/endpnt-dev/cipher" className="block text-sm text-muted-foreground hover:text-foreground">
                GitHub
              </Link>
              <Link href="https://endpnt.dev" className="block text-sm text-muted-foreground hover:text-foreground">
                endpnt.dev
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Support</h4>
            <div className="space-y-2">
              <a href="mailto:support@endpnt.dev" className="block text-sm text-muted-foreground hover:text-foreground">
                Email Support
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 endpnt.dev. Part of the{' '}
            <Link href="https://endpnt.dev" className="text-primary-600 hover:underline">
              endpnt.dev platform
            </Link>
            . Built with Next.js and deployed on Vercel.
          </p>
        </div>
      </div>
    </footer>
  )
}