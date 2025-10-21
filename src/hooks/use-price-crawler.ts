"use client"

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface CrawledProduct {
  name: string
  code: string
  sellPrice: number
  buyPrice: number
  inStock: boolean
  weight?: string
}

interface CrawlResult {
  success: boolean
  message: string
  products: CrawledProduct[]
  timestamp: string
}

export function usePriceCrawler() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<CrawlResult | null>(null)

  const crawlPrices = useCallback(async (): Promise<CrawlResult | null> => {
    if (isLoading) {
      toast.warning('Đang crawl giá, vui lòng chờ...')
      return null
    }

    setIsLoading(true)
    
    try {
      console.log('Starting price crawl...')
      
      const response = await fetch('/api/crawl-prices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result: CrawlResult = await response.json()
      
      if (result.success) {
        toast.success(`Crawl thành công: ${result.message}`)
        console.log('Crawl result:', result)
      } else {
        toast.error(`Crawl thất bại: ${result.message}`)
        console.error('Crawl failed:', result)
      }
      
      setLastResult(result)
      return result
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Crawl error:', error)
      
      const errorResult: CrawlResult = {
        success: false,
        message: errorMessage,
        products: [],
        timestamp: new Date().toISOString()
      }
      
      toast.error(`Lỗi crawl: ${errorMessage}`)
      setLastResult(errorResult)
      return errorResult
      
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  return {
    crawlPrices,
    isLoading,
    lastResult
  }
}
