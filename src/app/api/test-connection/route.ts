import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test connection to the price source
    const testUrl = 'https://silver.phuquygroup.vn'
    
    // Try with a short timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(testUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Connection successful',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: `HTTP ${response.status}: ${response.statusText}`,
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }
    
  } catch (error) {
    console.error('Connection test failed:', error)
    
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Connection failed',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
