import Link from 'next/link'
import { ArrowLeft, Hash, Key, Lock, UserCheck, Dices, FileText, Shield, AlertTriangle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ApiTester from '../components/ApiTester'
import CodeBlock from '../components/CodeBlock'

const quickStartExample = `curl -X POST https://cipher.endpnt.dev/api/v1/hash \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": "Hello, World!",
    "algorithm": "sha256"
  }'`

const responseExample = {
  "success": true,
  "data": {
    "hash": "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
    "algorithm": "sha256",
    "input_length": 13
  },
  "meta": {
    "request_id": "req_abc123",
    "processing_ms": 2,
    "remaining_credits": 4999
  }
}

const authExample = `// Include your API key in the x-api-key header
headers: {
  'x-api-key': 'ek_your_api_key_here',
  'Content-Type': 'application/json'
}`

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">API Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Complete reference for the Cipher API - cryptographic utilities for developers.
            </p>
          </div>

          {/* Quick Start */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary-600" />
              Quick Start
            </h2>
            <p className="text-muted-foreground">
              Get started with the Cipher API in minutes. All endpoints require authentication with an API key.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                <p className="text-muted-foreground mb-4">
                  Include your API key in the <code className="bg-muted px-1 rounded">x-api-key</code> header.
                </p>
                <CodeBlock code={authExample} language="javascript" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Example Request</h3>
                <CodeBlock code={quickStartExample} language="bash" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Example Response</h3>
                <CodeBlock code={JSON.stringify(responseExample, null, 2)} language="json" />
              </div>
            </div>
          </section>

          {/* Security Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Security Notice</h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  We never log your secrets, keys, or sensitive data. All cryptographic operations are performed
                  in memory and results are returned immediately. However, always use environment variables
                  or secure key management for your API keys and secrets.
                </p>
              </div>
            </div>
          </div>

          {/* Hash Operations */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Hash className="h-6 w-6 text-primary-600" />
                Hash Operations
              </h2>
              <p className="text-muted-foreground">
                Generate cryptographic hashes using various algorithms for data integrity and verification.
              </p>
            </div>

            <ApiTester
              endpoint="/api/v1/hash"
              title="POST /api/v1/hash"
              description="Generate a cryptographic hash of the provided data."
              parameters={[
                {
                  key: 'data',
                  label: 'Data',
                  type: 'textarea',
                  required: true,
                  placeholder: 'Text or data to hash',
                  defaultValue: 'Hello, World!'
                },
                {
                  key: 'algorithm',
                  label: 'Algorithm',
                  type: 'select',
                  required: true,
                  options: ['sha256', 'sha512', 'sha1', 'md5'],
                  defaultValue: 'sha256'
                }
              ]}
              exampleResponse={{
                success: true,
                data: {
                  hash: "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
                  algorithm: "sha256",
                  input_length: 13
                },
                meta: {
                  request_id: "req_abc123",
                  processing_ms: 2,
                  remaining_credits: 4999
                }
              }}
            />
          </section>

          {/* HMAC Operations */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Key className="h-6 w-6 text-primary-600" />
                HMAC Operations
              </h2>
              <p className="text-muted-foreground">
                Generate and verify Hash-based Message Authentication Codes for message integrity and authentication.
              </p>
            </div>

            <div className="space-y-8">
              <ApiTester
                endpoint="/api/v1/hmac/compute"
                title="POST /api/v1/hmac/compute"
                description="Generate an HMAC signature for the provided data and secret."
                parameters={[
                  {
                    key: 'data',
                    label: 'Data',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Message to sign',
                    defaultValue: 'Important message'
                  },
                  {
                    key: 'secret',
                    label: 'Secret Key',
                    type: 'text',
                    required: true,
                    placeholder: 'Your secret key',
                    defaultValue: 'your-secret-key'
                  },
                  {
                    key: 'algorithm',
                    label: 'Algorithm',
                    type: 'select',
                    required: true,
                    options: ['sha256', 'sha512', 'sha1'],
                    defaultValue: 'sha256'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    signature: "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8",
                    algorithm: "sha256"
                  },
                  meta: {
                    request_id: "req_def456",
                    processing_ms: 1
                  }
                }}
              />

              <ApiTester
                endpoint="/api/v1/hmac/verify"
                title="POST /api/v1/hmac/verify"
                description="Verify an HMAC signature against the provided data and secret."
                parameters={[
                  {
                    key: 'data',
                    label: 'Data',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Original message',
                    defaultValue: 'Important message'
                  },
                  {
                    key: 'signature',
                    label: 'Signature',
                    type: 'text',
                    required: true,
                    placeholder: 'HMAC signature to verify',
                    defaultValue: 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8'
                  },
                  {
                    key: 'secret',
                    label: 'Secret Key',
                    type: 'text',
                    required: true,
                    placeholder: 'Your secret key',
                    defaultValue: 'your-secret-key'
                  },
                  {
                    key: 'algorithm',
                    label: 'Algorithm',
                    type: 'select',
                    required: true,
                    options: ['sha256', 'sha512', 'sha1'],
                    defaultValue: 'sha256'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    valid: true,
                    algorithm: "sha256"
                  },
                  meta: {
                    request_id: "req_ghi789",
                    processing_ms: 1
                  }
                }}
              />
            </div>
          </section>

          {/* JWT Operations */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary-600" />
                JWT Operations
              </h2>
              <p className="text-muted-foreground">
                Sign, verify, and decode JSON Web Tokens for authentication and authorization.
              </p>
            </div>

            <div className="space-y-8">
              <ApiTester
                endpoint="/api/v1/jwt/sign"
                title="POST /api/v1/jwt/sign"
                description="Create and sign a JWT token with the provided payload and secret."
                parameters={[
                  {
                    key: 'payload',
                    label: 'Payload (JSON)',
                    type: 'textarea',
                    required: true,
                    placeholder: '{"user_id": "12345", "role": "admin"}',
                    defaultValue: '{"user_id": "12345", "role": "admin"}'
                  },
                  {
                    key: 'secret',
                    label: 'Secret Key',
                    type: 'text',
                    required: true,
                    placeholder: 'Your JWT secret',
                    defaultValue: 'your-jwt-secret'
                  },
                  {
                    key: 'algorithm',
                    label: 'Algorithm',
                    type: 'select',
                    required: true,
                    options: ['HS256', 'HS384', 'HS512'],
                    defaultValue: 'HS256'
                  },
                  {
                    key: 'expires_in',
                    label: 'Expires In',
                    type: 'text',
                    placeholder: '1h, 30m, 7d, etc.',
                    defaultValue: '1h'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    expires_in: "1h",
                    algorithm: "HS256"
                  },
                  meta: {
                    request_id: "req_jkl012",
                    processing_ms: 3
                  }
                }}
              />

              <ApiTester
                endpoint="/api/v1/jwt/verify"
                title="POST /api/v1/jwt/verify"
                description="Verify a JWT token's signature and decode its payload."
                parameters={[
                  {
                    key: 'token',
                    label: 'JWT Token',
                    type: 'textarea',
                    required: true,
                    placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    defaultValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzA5NjY0MDAsImV4cCI6MTY3MDk3MDAwMH0.signature'
                  },
                  {
                    key: 'secret',
                    label: 'Secret Key',
                    type: 'text',
                    required: true,
                    placeholder: 'Your JWT secret',
                    defaultValue: 'your-jwt-secret'
                  },
                  {
                    key: 'algorithm',
                    label: 'Algorithm',
                    type: 'select',
                    required: true,
                    options: ['HS256', 'HS384', 'HS512'],
                    defaultValue: 'HS256'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    valid: true,
                    payload: {
                      user_id: "12345",
                      role: "admin",
                      iat: 1670966400,
                      exp: 1670970000
                    },
                    algorithm: "HS256"
                  },
                  meta: {
                    request_id: "req_mno345",
                    processing_ms: 2
                  }
                }}
              />

              <ApiTester
                endpoint="/api/v1/jwt/decode"
                title="POST /api/v1/jwt/decode"
                description="Decode a JWT token without signature verification."
                parameters={[
                  {
                    key: 'token',
                    label: 'JWT Token',
                    type: 'textarea',
                    required: true,
                    placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    defaultValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzA5NjY0MDAsImV4cCI6MTY3MDk3MDAwMH0.signature'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    header: {
                      alg: "HS256",
                      typ: "JWT"
                    },
                    payload: {
                      user_id: "12345",
                      role: "admin",
                      iat: 1670966400,
                      exp: 1670970000
                    }
                  },
                  meta: {
                    request_id: "req_pqr678",
                    processing_ms: 1
                  }
                }}
              />
            </div>
          </section>

          {/* Password Operations */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary-600" />
                Password Operations
              </h2>
              <p className="text-muted-foreground">
                Secure password hashing and verification using bcrypt with configurable cost factors.
              </p>
            </div>

            <div className="space-y-8">
              <ApiTester
                endpoint="/api/v1/password/hash"
                title="POST /api/v1/password/hash"
                description="Generate a secure bcrypt hash of a password."
                parameters={[
                  {
                    key: 'password',
                    label: 'Password',
                    type: 'text',
                    required: true,
                    placeholder: 'Password to hash',
                    defaultValue: 'user-password'
                  },
                  {
                    key: 'cost',
                    label: 'Cost Factor',
                    type: 'number',
                    min: 10,
                    max: 15,
                    placeholder: '10-15 (default: 12)',
                    defaultValue: 12
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    hash: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeNNoIZtHHwS3UWKe",
                    cost: 12
                  },
                  meta: {
                    request_id: "req_stu901",
                    processing_ms: 85
                  }
                }}
              />

              <ApiTester
                endpoint="/api/v1/password/verify"
                title="POST /api/v1/password/verify"
                description="Verify a password against a bcrypt hash."
                parameters={[
                  {
                    key: 'password',
                    label: 'Password',
                    type: 'text',
                    required: true,
                    placeholder: 'Password to verify',
                    defaultValue: 'user-password'
                  },
                  {
                    key: 'hash',
                    label: 'Bcrypt Hash',
                    type: 'textarea',
                    required: true,
                    placeholder: '$2b$12$...',
                    defaultValue: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeNNoIZtHHwS3UWKe'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    valid: true,
                    cost: 12
                  },
                  meta: {
                    request_id: "req_vwx234",
                    processing_ms: 82
                  }
                }}
              />
            </div>
          </section>

          {/* Random Generation */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Dices className="h-6 w-6 text-primary-600" />
                Random Generation
              </h2>
              <p className="text-muted-foreground">
                Generate cryptographically secure random data, tokens, and UUIDs.
              </p>
            </div>

            <div className="space-y-8">
              <ApiTester
                endpoint="/api/v1/random"
                title="POST /api/v1/random"
                description="Generate cryptographically secure random data in various formats."
                parameters={[
                  {
                    key: 'type',
                    label: 'Output Type',
                    type: 'select',
                    required: true,
                    options: ['hex', 'base64', 'uuid'],
                    defaultValue: 'hex'
                  },
                  {
                    key: 'length',
                    label: 'Length (bytes)',
                    type: 'number',
                    min: 1,
                    max: 1024,
                    placeholder: 'Only for hex/base64 types',
                    defaultValue: 32
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    value: "a3f5d9e8b2c1f4e7a9d6c3b8f2e5a1d7c9b6f3e8a2d5c7b1f9e4a8d3c6b2f5e9",
                    type: "hex",
                    length: 32
                  },
                  meta: {
                    request_id: "req_yza567",
                    processing_ms: 1
                  }
                }}
              />

              <ApiTester
                endpoint="/api/v1/uuid"
                title="POST /api/v1/uuid"
                description="Generate UUIDs in different versions and formats."
                parameters={[
                  {
                    key: 'version',
                    label: 'UUID Version',
                    type: 'select',
                    required: true,
                    options: ['v4', 'v1'],
                    defaultValue: 'v4'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                    version: "v4"
                  },
                  meta: {
                    request_id: "req_bcd890",
                    processing_ms: 1
                  }
                }}
              />
            </div>
          </section>

          {/* Encoding Operations */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary-600" />
                Encoding Operations
              </h2>
              <p className="text-muted-foreground">
                Encode and decode data in various formats including Base64, hex, and URL-safe variants.
              </p>
            </div>

            <div className="space-y-8">
              <ApiTester
                endpoint="/api/v1/encode"
                title="POST /api/v1/encode"
                description="Encode text data in various formats."
                parameters={[
                  {
                    key: 'data',
                    label: 'Data',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Text to encode',
                    defaultValue: 'Hello, Cipher API!'
                  },
                  {
                    key: 'encoding',
                    label: 'Encoding',
                    type: 'select',
                    required: true,
                    options: ['base64', 'base64url', 'hex'],
                    defaultValue: 'base64'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    encoded: "SGVsbG8sIENpcGhlciBBUEkh",
                    encoding: "base64",
                    input_length: 18
                  },
                  meta: {
                    request_id: "req_efg123",
                    processing_ms: 1
                  }
                }}
              />

              <ApiTester
                endpoint="/api/v1/decode"
                title="POST /api/v1/decode"
                description="Decode encoded data back to its original form."
                parameters={[
                  {
                    key: 'data',
                    label: 'Encoded Data',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Encoded data to decode',
                    defaultValue: 'SGVsbG8sIENpcGhlciBBUEkh'
                  },
                  {
                    key: 'encoding',
                    label: 'Encoding',
                    type: 'select',
                    required: true,
                    options: ['base64', 'base64url', 'hex'],
                    defaultValue: 'base64'
                  }
                ]}
                exampleResponse={{
                  success: true,
                  data: {
                    decoded: "Hello, Cipher API!",
                    encoding: "base64",
                    output_length: 18
                  },
                  meta: {
                    request_id: "req_hij456",
                    processing_ms: 1
                  }
                }}
              />
            </div>
          </section>

          {/* Error Codes */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Error Codes</h2>
            <p className="text-muted-foreground">
              The API returns standard HTTP status codes and specific error codes in the response body.
            </p>

            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Common Error Codes</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="font-mono font-semibold">INVALID_API_KEY</div>
                  <div className="text-muted-foreground">401</div>
                  <div>API key is missing or invalid</div>

                  <div className="font-mono font-semibold">RATE_LIMIT_EXCEEDED</div>
                  <div className="text-muted-foreground">429</div>
                  <div>Too many requests</div>

                  <div className="font-mono font-semibold">INVALID_PARAMS</div>
                  <div className="text-muted-foreground">400</div>
                  <div>Missing or invalid parameters</div>

                  <div className="font-mono font-semibold">UNSUPPORTED_ALGORITHM</div>
                  <div className="text-muted-foreground">400</div>
                  <div>Algorithm not supported</div>

                  <div className="font-mono font-semibold">INVALID_JWT</div>
                  <div className="text-muted-foreground">400</div>
                  <div>Malformed JWT token</div>

                  <div className="font-mono font-semibold">JWT_EXPIRED</div>
                  <div className="text-muted-foreground">401</div>
                  <div>JWT token has expired</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}