'use client'

import { useState } from 'react'
import { Play, Loader2, Hash, Key, Lock, Dices } from 'lucide-react'
import CodeBlock from './CodeBlock'

interface DemoResponse {
  success: boolean
  data?: any
  error?: {
    code: string
    message: string
  }
  meta: {
    request_id: string
    processing_ms: number
  }
}

type DemoType = 'hash' | 'hmac' | 'encode' | 'random'

interface DemoField {
  key: string
  label: string
  type: 'textarea' | 'select' | 'number' | 'text'
  required?: boolean
  options?: string[]
  min?: number
  max?: number
}

const demoConfig = {
  hash: {
    icon: Hash,
    title: 'Hash Data',
    description: 'Generate SHA-256 hash',
    endpoint: '/api/demo/hash',
    defaultParams: {
      data: 'Hello, World!',
      algorithm: 'sha256'
    },
    fields: [
      { key: 'data', label: 'Data to hash', type: 'textarea', required: true },
      {
        key: 'algorithm',
        label: 'Algorithm',
        type: 'select',
        options: ['sha256', 'sha512', 'sha1', 'md5'],
        required: true
      }
    ] as DemoField[]
  },
  hmac: {
    icon: Key,
    title: 'HMAC Compute',
    description: 'Generate HMAC signature',
    endpoint: '/api/demo/hmac/compute',
    defaultParams: {
      data: 'Important message',
      secret: 'demo-secret-key',
      algorithm: 'sha256'
    },
    fields: [
      { key: 'data', label: 'Data to sign', type: 'textarea', required: true },
      { key: 'secret', label: 'Secret key', type: 'text', required: true },
      {
        key: 'algorithm',
        label: 'Algorithm',
        type: 'select',
        options: ['sha256', 'sha512', 'sha1'],
        required: true
      }
    ] as DemoField[]
  },
  encode: {
    icon: Lock,
    title: 'Base64 Encode',
    description: 'Encode text to Base64',
    endpoint: '/api/demo/encode',
    defaultParams: {
      data: 'Hello, Cipher API!',
      encoding: 'base64'
    },
    fields: [
      { key: 'data', label: 'Text to encode', type: 'textarea', required: true },
      {
        key: 'encoding',
        label: 'Encoding',
        type: 'select',
        options: ['base64', 'base64url', 'hex'],
        required: true
      }
    ] as DemoField[]
  },
  random: {
    icon: Dices,
    title: 'Generate Random',
    description: 'Generate secure random data',
    endpoint: '/api/demo/random',
    defaultParams: {
      type: 'hex',
      length: 32
    },
    fields: [
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: ['hex', 'base64', 'uuid'],
        required: true
      },
      { key: 'length', label: 'Length (bytes)', type: 'number', min: 1, max: 1024 }
    ] as DemoField[]
  }
}

export default function CipherDemo() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('hash')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<DemoResponse | null>(null)
  const [params, setParams] = useState<Record<string, any>>(demoConfig[activeDemo].defaultParams)

  const handleDemoChange = (demo: DemoType) => {
    setActiveDemo(demo)
    setParams(demoConfig[demo].defaultParams)
    setResponse(null)
  }

  const handleParamChange = (key: string, value: any) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleTest = async () => {
    setLoading(true)
    setResponse(null)

    try {
      const config = demoConfig[activeDemo]
      const requestBody = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {} as any)

      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await res.json()
      setResponse(result)
    } catch (error) {
      setResponse({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Failed to connect to API',
        },
        meta: {
          request_id: 'unknown',
          processing_ms: 0,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const currentConfig = demoConfig[activeDemo]
  const Icon = currentConfig.icon

  return (
    <div className="bg-muted/30 rounded-lg p-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold mb-6 text-center">Try Cipher API</h3>

        {/* Demo Selector */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {Object.entries(demoConfig).map(([key, config]) => {
            const IconComponent = config.icon
            return (
              <button
                key={key}
                onClick={() => handleDemoChange(key as DemoType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeDemo === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-background border border-border hover:bg-muted'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="font-medium">{config.title}</span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                <Icon className="h-5 w-5 text-primary-600" />
                <h4 className="text-lg font-medium">{currentConfig.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{currentConfig.description}</p>
            </div>

            {/* Parameter Form */}
            <div className="space-y-4">
              {currentConfig.fields.map((field) => (
                <div key={field.key}>
                  <label htmlFor={field.key} className="block text-sm font-medium mb-1">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.key}
                      value={params[field.key] || ''}
                      onChange={(e) => handleParamChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md resize-none"
                      rows={3}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.key}
                      value={params[field.key] || ''}
                      onChange={(e) => handleParamChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'number' ? (
                    <input
                      id={field.key}
                      type="number"
                      min={field.min}
                      max={field.max}
                      value={params[field.key] || ''}
                      onChange={(e) => handleParamChange(field.key, Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                    />
                  ) : (
                    <input
                      id={field.key}
                      type="text"
                      value={params[field.key] || ''}
                      onChange={(e) => handleParamChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Test Button */}
            <button
              onClick={handleTest}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {loading ? 'Processing...' : 'Test API'}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {response && (
              <>
                {/* Result Display */}
                {response.success && response.data && (
                  <div className="bg-background rounded-lg p-6 border border-border">
                    <h4 className="font-medium mb-4">Result</h4>
                    <div className="space-y-3">
                      {Object.entries(response.data).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}:
                          </div>
                          <div className="font-mono text-sm bg-muted px-3 py-2 rounded break-all">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full JSON Response */}
                <div>
                  <h4 className="font-medium mb-4">API Response</h4>
                  <CodeBlock
                    code={JSON.stringify(response, null, 2)}
                    language="json"
                  />
                </div>
              </>
            )}

            {!response && (
              <div className="bg-background rounded-lg p-6 border border-border text-center text-muted-foreground">
                Click "Test API" to see results here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}