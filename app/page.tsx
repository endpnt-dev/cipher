import Link from 'next/link'
import { Shield, Hash, Key, Lock, UserCheck, Dices, Settings, ArrowRight, Code, Github, Sparkles, Zap } from 'lucide-react'
import CodeBlock from './components/CodeBlock'
import Header from './components/Header'
import Footer from './components/Footer'
import CipherDemo from './components/CipherDemo'

const features = [
  {
    icon: Hash,
    title: 'Cryptographic Hashing',
    description: 'SHA-256, SHA-512, SHA-1, MD5 algorithms for data integrity and verification'
  },
  {
    icon: Key,
    title: 'HMAC Operations',
    description: 'Generate and verify HMAC signatures for authentication and message integrity'
  },
  {
    icon: Lock,
    title: 'JWT Tokens',
    description: 'Sign, verify, and decode JSON Web Tokens with multiple algorithms'
  },
  {
    icon: UserCheck,
    title: 'Password Hashing',
    description: 'Secure bcrypt password hashing with configurable cost factors'
  },
  {
    icon: Dices,
    title: 'Random Generation',
    description: 'Cryptographically secure random data, UUIDs, and tokens'
  },
  {
    icon: Settings,
    title: 'Encoding Utilities',
    description: 'Base64, hex, and URL-safe encoding/decoding operations'
  }
]

const codeExamples = {
  curl: `curl -X POST https://cipher.endpnt.dev/api/v1/hash \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": "Hello, World!",
    "algorithm": "sha256"
  }'`,

  jwt: `curl -X POST https://cipher.endpnt.dev/api/v1/jwt/sign \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "payload": {
      "user_id": "12345",
      "role": "admin"
    },
    "secret": "your-secret-key",
    "algorithm": "HS256",
    "expires_in": "1h"
  }'`,

  javascript: `const response = await fetch('https://cipher.endpnt.dev/api/v1/password/hash', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    password: 'user-password',
    cost: 12
  })
});

const result = await response.json();
if (result.success) {
  const hashedPassword = result.data.hash;
}`,

  python: `import requests
import hashlib

url = "https://cipher.endpnt.dev/api/v1/hmac/compute"
headers = {
    "x-api-key": "YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "data": "Important message",
    "secret": "shared-secret-key",
    "algorithm": "sha256"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

if result["success"]:
    signature = result["data"]["signature"]
    print(f"HMAC: {signature}")`
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Cryptographic utilities
                <br />
                <span className="text-primary-600">for developers</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Fast, secure cryptographic API with hashing, HMAC, JWT, password utilities, and more.
                Perfect for security automation and application integration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors"
              >
                <Code className="h-4 w-4" />
                View docs
              </Link>
            </div>

            {/* Quick example */}
            <div className="max-w-2xl mx-auto">
              <CodeBlock
                code={codeExamples.curl}
                language="bash"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete cryptographic toolkit</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with industry standards and optimized for security, performance, and developer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary-600/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security First Section */}
      <section className="py-20 bg-gradient-to-b from-primary-50/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary-600" />
              <h2 className="text-3xl font-bold">Security First</h2>
              <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                TRUSTED
              </span>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enterprise-grade cryptographic operations with proper key management, rate limiting, and audit trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600/10 flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold">Zero Log Policy</h3>
              <p className="text-muted-foreground">We never log your secrets, keys, or sensitive data</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600/10 flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold">Rate Limited</h3>
              <p className="text-muted-foreground">Built-in rate limiting prevents abuse and ensures availability</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold">Industry Standards</h3>
              <p className="text-muted-foreground">Implements proven algorithms and security best practices</p>
            </div>
          </div>

          {/* Interactive Demo */}
          <CipherDemo />
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Easy integration</h2>
            <p className="text-muted-foreground text-lg">
              Works with any programming language that can make HTTP requests
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-medium">JWT Token Signing</h3>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                    Popular
                  </span>
                </div>
                <CodeBlock
                  code={codeExamples.jwt}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">JavaScript</h3>
                <CodeBlock
                  code={codeExamples.javascript}
                  language="javascript"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Python</h3>
                <CodeBlock
                  code={codeExamples.python}
                  language="python"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to secure your application?</h2>
            <p className="text-muted-foreground text-lg">
              Join developers building secure applications with our cryptographic API.
              Start with 100 free requests per month.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium text-lg"
            >
              Get your free API key
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}