'use client'

import { useState } from 'react'
import { Play, Loader2, AlertCircle } from 'lucide-react'
import CodeBlock from './CodeBlock'

interface ApiResponse {
  success: boolean
  data?: any
  error?: {
    code: string
    message: string
  }
  meta: {
    request_id: string
    processing_ms: number
    remaining_credits?: number
  }
}

interface ApiTesterProps {
  endpoint: string
  title: string
  description: string
  parameters: {
    key: string
    label: string
    type: 'text' | 'textarea' | 'select' | 'number' | 'checkbox'
    required?: boolean
    options?: string[]
    placeholder?: string
    min?: number
    max?: number
    defaultValue?: any
  }[]
  exampleResponse?: any
}

export default function ApiTester({
  endpoint,
  title,
  description,
  parameters,
  exampleResponse
}: ApiTesterProps) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [params, setParams] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    parameters.forEach(param => {
      if (param.defaultValue !== undefined) {
        initial[param.key] = param.defaultValue
      }
    })
    return initial
  })

  const handleParamChange = (key: string, value: any) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setResponse({
        success: false,
        error: {
          code: 'MISSING_API_KEY',
          message: 'API key is required',
        },
        meta: {
          request_id: 'client-error',
          processing_ms: 0,
        },
      })
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const requestBody = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {} as any)

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* API Key Input */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              API Key Required
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              This endpoint requires authentication. Enter your API key to test.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono text-sm"
              placeholder="ek_your_api_key_here"
            />
          </div>
        </div>
      </div>

      {/* Parameters Form */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-6">Parameters</h4>

        <div className="space-y-4">
          {parameters.map((param) => (
            <div key={param.key}>
              <label htmlFor={`param-${param.key}`} className="block text-sm font-medium mb-1">
                {param.label} {param.required && <span className="text-red-400">*</span>}
              </label>

              {param.type === 'textarea' ? (
                <textarea
                  id={`param-${param.key}`}
                  value={params[param.key] || ''}
                  onChange={(e) => handleParamChange(param.key, e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md resize-none font-mono text-sm"
                  rows={3}
                  placeholder={param.placeholder}
                />
              ) : param.type === 'select' ? (
                <select
                  id={`param-${param.key}`}
                  value={params[param.key] || ''}
                  onChange={(e) => handleParamChange(param.key, e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md"
                >
                  {param.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : param.type === 'number' ? (
                <input
                  id={`param-${param.key}`}
                  type="number"
                  min={param.min}
                  max={param.max}
                  value={params[param.key] || ''}
                  onChange={(e) => handleParamChange(param.key, Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md"
                  placeholder={param.placeholder}
                />
              ) : param.type === 'checkbox' ? (
                <label className="flex items-center gap-2">
                  <input
                    id={`param-${param.key}`}
                    type="checkbox"
                    checked={params[param.key] || false}
                    onChange={(e) => handleParamChange(param.key, e.target.checked)}
                    className="rounded border border-border"
                  />
                  <span className="text-sm">{param.placeholder}</span>
                </label>
              ) : (
                <input
                  id={`param-${param.key}`}
                  type="text"
                  value={params[param.key] || ''}
                  onChange={(e) => handleParamChange(param.key, e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono text-sm"
                  placeholder={param.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        {/* Test Button */}
        <div className="mt-6">
          <button
            onClick={handleTest}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {loading ? 'Testing...' : 'Test API'}
          </button>
        </div>
      </div>

      {/* Response */}
      {response && (
        <div className="space-y-6">
          {/* Success Data */}
          {response.success && response.data && (
            <div className="bg-background rounded-lg p-6 border border-border">
              <h4 className="text-lg font-semibold mb-4">Result</h4>
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
            <h4 className="text-lg font-semibold mb-4">Full Response</h4>
            <CodeBlock
              code={JSON.stringify(response, null, 2)}
              language="json"
            />
          </div>
        </div>
      )}

      {/* Example Response */}
      {!response && exampleResponse && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Example Response</h4>
          <CodeBlock
            code={JSON.stringify(exampleResponse, null, 2)}
            language="json"
          />
        </div>
      )}
    </div>
  )
}