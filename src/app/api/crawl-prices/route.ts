import { NextRequest, NextResponse } from 'next/server'

interface CrawledProduct {
  name: string
  code: string
  sellPrice: number
  buyPrice: number
  inStock: boolean
  weight?: string
}

// Simple price parser for Vietnamese currency
function parsePrice(priceText: string): number {
  if (!priceText) return 0
  
  // Remove all non-numeric characters except dots and commas
  const cleaned = priceText.replace(/[^\d.,]/g, '')
  
  // Handle Vietnamese number format (1.000.000 or 1,000,000)
  const normalized = cleaned.replace(/\./g, '').replace(',', '.')
  
  return parseFloat(normalized) || 0
}

// Enhanced HTML parser for Phú Quý silver prices
function parseProductsFromHTML(html: string): CrawledProduct[] {
  const products: CrawledProduct[] = []
  
  try {
    // Common patterns for Vietnamese silver price websites
    const patterns = [
      // Pattern 1: Table rows with prices
      /<tr[^>]*>.*?<td[^>]*>([^<]+(?:bạc|silver|phú quý)[^<]*)<\/td>.*?<td[^>]*>([^<]+)<\/td>.*?<td[^>]*>([^<]+)<\/td>/gi,
      
      // Pattern 2: Div containers with prices
      /<div[^>]*class="[^"]*product[^"]*"[^>]*>.*?<[^>]*>([^<]+(?:bạc|silver|phú quý)[^<]*)<\/[^>]*>.*?<[^>]*>([^<]+)<\/[^>]*>.*?<[^>]*>([^<]+)<\/[^>]*>/gi,
      
      // Pattern 3: List items with prices
      /<li[^>]*>.*?([^<]+(?:bạc|silver|phú quý)[^<]*).*?([0-9.,\s]+).*?([0-9.,\s]+)/gi,
      
      // Pattern 4: Simple text patterns
      /([A-Za-zÀ-ỹ\s]+(?:bạc|silver|phú quý)[A-Za-zÀ-ỹ\s]*)[:\s]*([0-9.,\s]+)[:\s]*([0-9.,\s]+)/gi
    ]
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(html)) !== null) {
        const name = match[1]?.trim()
        const sellPriceText = match[2]?.trim()
        const buyPriceText = match[3]?.trim()
        
        if (name && sellPriceText) {
          const sellPrice = parsePrice(sellPriceText)
          const buyPrice = buyPriceText ? parsePrice(buyPriceText) : sellPrice * 0.95
          
          if (sellPrice > 0) {
            // Extract weight from name if available
            const weightMatch = name.match(/\(([^)]+)\)/)
            const weight = weightMatch ? weightMatch[1] : '1kg'
            
            // Clean product name
            const cleanName = name.replace(/\([^)]+\)/g, '').trim()
            
            products.push({
              name: cleanName,
              code: `PQ${products.length + 1}`,
              sellPrice,
              buyPrice,
              inStock: true,
              weight
            })
            
            console.log(`Parsed: ${cleanName} - Sell: ${sellPrice} - Buy: ${buyPrice}`)
          }
        }
      }
    }
    
    // If no products found with patterns, try simple regex approach
    if (products.length === 0) {
      const priceRegex = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)/g
      const prices = [...html.matchAll(priceRegex)].map(m => m[0])
      
      // Look for product names near prices
      const nameRegex = /([A-Za-zÀ-ỹ\s]+(?:bạc|silver|phú quý)[A-Za-zÀ-ỹ\s]*)/gi
      const names = [...html.matchAll(nameRegex)].map(m => m[1].trim())
      
      for (let i = 0; i < Math.min(prices.length, names.length, 10); i++) {
        const price = parsePrice(prices[i])
        const name = names[i]
        
        if (price > 100000 && name) { // Only prices > 100k VND
          products.push({
            name,
            code: `PQ${i + 1}`,
            sellPrice: price,
            buyPrice: price * 0.95,
            inStock: true,
            weight: '1kg'
          })
        }
      }
    }
    
    console.log(`Total parsed: ${products.length} products`)
    return products
    
  } catch (error) {
    console.error('Error parsing HTML:', error)
    return []
  }
}

// Simple fetch with timeout
async function fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.text()
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    const baseUrl = 'https://silver.phuquygroup.vn'
    
    console.log('Starting price crawl from:', baseUrl)
    
    // Try direct fetch first
    let html: string
    try {
      html = await fetchWithTimeout(baseUrl, 15000)
      console.log('Direct fetch successful')
    } catch (error) {
      console.log('Direct fetch failed, trying CORS proxy...')
      
      // Fallback to CORS proxy
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`
      html = await fetchWithTimeout(proxyUrl, 20000)
      console.log('CORS proxy fetch successful')
    }
    
    // Parse products from HTML
    const products = parseProductsFromHTML(html)
    
    if (products.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No products found in HTML',
        products: []
      }, { status: 404 })
    }
    
    console.log(`Successfully crawled ${products.length} products`)
    
    return NextResponse.json({
      success: true,
      message: `Found ${products.length} products`,
      products,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Price crawl error:', error)
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      products: [],
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
