"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Download, CheckCircle, XCircle } from 'lucide-react'
import { usePriceCrawler } from '@/hooks/use-price-crawler'

export function PriceCrawlerTest() {
  const { crawlPrices, isLoading, lastResult } = usePriceCrawler()
  const [showDetails, setShowDetails] = useState(false)

  const handleCrawl = async () => {
    await crawlPrices()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Price Crawler Test</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleCrawl}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Đang crawl...' : 'Crawl Giá'}
          </Button>
          
          {lastResult && (
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
            </Button>
          )}
        </div>
      </div>

      {/* Status */}
      {lastResult && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {lastResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <Badge variant={lastResult.success ? 'default' : 'destructive'}>
              {lastResult.success ? 'Thành công' : 'Thất bại'}
            </Badge>
            <span className="text-sm text-gray-600">
              {new Date(lastResult.timestamp).toLocaleString('vi-VN')}
            </span>
          </div>
          <p className="text-sm text-gray-700">{lastResult.message}</p>
        </div>
      )}

      {/* Results */}
      {lastResult && lastResult.products.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Sản phẩm tìm thấy ({lastResult.products.length})
          </h3>
          
          <div className="grid gap-3">
            {lastResult.products.map((product, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">Mã: {product.code}</p>
                    {product.weight && (
                      <p className="text-sm text-gray-600">Trọng lượng: {product.weight}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Bán:</span>
                        <span className="font-semibold text-green-600">
                          {formatPrice(product.sellPrice)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Mua:</span>
                        <span className="font-semibold text-blue-600">
                          {formatPrice(product.buyPrice)}
                        </span>
                      </div>
                      <Badge variant={product.inStock ? 'default' : 'secondary'}>
                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Error details */}
      {lastResult && !lastResult.success && showDetails && (
        <Card className="p-4 bg-red-50 border-red-200">
          <h4 className="font-medium text-red-800 mb-2">Chi tiết lỗi:</h4>
          <p className="text-sm text-red-700">{lastResult.message}</p>
        </Card>
      )}
    </Card>
  )
}
