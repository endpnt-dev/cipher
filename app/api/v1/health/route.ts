import { NextRequest } from 'next/server'
import { successResponse, generateRequestId } from '@/lib/response'
import { API_VERSION } from '@/lib/config'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const requestId = generateRequestId()

  // Simple health check - no auth required
  const data = {
    status: 'healthy',
    service: 'cipher-api',
    version: API_VERSION,
    timestamp: new Date().toISOString()
  }

  const processingTime = Date.now() - startTime

  return successResponse(data, {
    request_id: requestId,
    processing_ms: processingTime
  })
}

export async function POST(request: NextRequest) {
  // For consistency, support both GET and POST for health checks
  return GET(request)
}