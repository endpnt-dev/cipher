import Link from 'next/link'
import { ArrowLeft, Check, X } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PricingTable from '../components/PricingTable'

const features = [
  { name: 'Requests per month', free: '100', starter: '5,000', pro: '25,000', enterprise: '100,000+' },
  { name: 'Rate limit (req/min)', free: '10', starter: '60', pro: '300', enterprise: '1,000+' },
  { name: 'Hash algorithms', free: true, starter: true, pro: true, enterprise: true },
  { name: 'HMAC operations', free: true, starter: true, pro: true, enterprise: true },
  { name: 'JWT signing/verify', free: true, starter: true, pro: true, enterprise: true },
  { name: 'Password hashing', free: true, starter: true, pro: true, enterprise: true },
  { name: 'Random generation', free: true, starter: true, pro: true, enterprise: true },
  { name: 'Base64/Hex encoding', free: true, starter: true, pro: true, enterprise: true },
  { name: 'Email support', free: false, starter: true, pro: true, enterprise: true },
  { name: 'Priority processing', free: false, starter: true, pro: true, enterprise: true },
  { name: 'Webhook notifications', free: false, starter: false, pro: true, enterprise: true },
  { name: 'Custom rate limits', free: false, starter: false, pro: false, enterprise: true },
  { name: 'White-label API', free: false, starter: false, pro: false, enterprise: true },
  { name: 'Dedicated support', free: false, starter: false, pro: false, enterprise: true },
  { name: 'SLA guarantee', free: false, starter: false, pro: '99.9%', enterprise: 'Custom' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Back Link */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* Hero */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our complete cryptographic API.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <PricingTable />
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Feature comparison</h2>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full bg-background rounded-lg border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Features</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold bg-primary-50/50 dark:bg-primary-950/20">Starter</th>
                  <th className="text-center p-4 font-semibold">Pro</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={feature.name} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                    <td className="p-4 font-medium">{feature.name}</td>
                    <td className="p-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="h-5 w-5 text-primary-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{feature.free}</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-primary-50/50 dark:bg-primary-950/20">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <Check className="h-5 w-5 text-primary-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium">{feature.starter}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="h-5 w-5 text-primary-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{feature.pro}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <Check className="h-5 w-5 text-primary-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I get started?</h3>
                <p className="text-muted-foreground">
                  Sign up for a free account to get your API key. You'll immediately have access to 100 requests per month
                  to test all our cryptographic endpoints.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Do you store our secrets or keys?</h3>
                <p className="text-muted-foreground">
                  No. We have a strict zero-log policy for sensitive data. Secrets, passwords, and keys are processed
                  in memory and never stored or logged.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">What happens if I exceed my rate limit?</h3>
                <p className="text-muted-foreground">
                  Requests beyond your rate limit will receive a 429 status code. You can upgrade your plan for higher
                  limits or wait for the rate limit window to reset.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Yes, all paid plans can be cancelled at any time. You'll continue to have access to paid features
                  until the end of your current billing period.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Do you offer custom enterprise solutions?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer custom solutions for enterprise customers including dedicated infrastructure,
                  custom SLAs, and white-label options. Contact our sales team for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join developers building secure applications with our cryptographic API.
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors">
            Start for free
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}