import { NextRequest } from 'next/server'
import { makeDemoApiCall } from '@/lib/demo-proxy'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return makeDemoApiCall(request, '/api/v1/uuid', body)
}

export async function GET(request: NextRequest) {
  // For GET requests, pass empty body to generate UUID v4
  return makeDemoApiCall(request, '/api/v1/uuid', {})
}