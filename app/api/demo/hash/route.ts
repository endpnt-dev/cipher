import { NextRequest } from 'next/server'
import { makeDemoApiCall } from '@/lib/demo-proxy'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return makeDemoApiCall(request, '/api/v1/hash', body)
}