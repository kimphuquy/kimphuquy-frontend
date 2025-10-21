"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"

interface ApiStatusProps {
  onRetry?: () => void
}

export function ApiStatus({ onRetry }: ApiStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      // Test connection to the price API
      const response = await fetch('/api/test-connection', {
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      if (response.ok) {
        setIsConnected(true)
        setLastCheck(new Date())
        toast.success("Kết nối API thành công!")
      } else {
        setIsConnected(false)
        setLastCheck(new Date())
        toast.error("API không phản hồi")
      }
    } catch (error) {
      setIsConnected(false)
      setLastCheck(new Date())
      console.error("Connection test failed:", error)
      toast.error("Không thể kết nối đến server")
    } finally {
      setIsChecking(false)
    }
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    }
    checkConnection()
  }

  useEffect(() => {
    // Check connection on mount
    checkConnection()
  }, [])

  if (isConnected === null) {
    return null // Don't show anything while checking
  }

  return (
    <Card className={`fixed top-4 right-4 z-50 p-3 max-w-sm ${
      isConnected 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-2">
        {isConnected ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-600" />
        )}
        
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isConnected ? 'text-green-800' : 'text-red-800'
          }`}>
            {isConnected ? 'API hoạt động bình thường' : 'API không khả dụng'}
          </p>
          
          {lastCheck && (
            <p className={`text-xs ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              Kiểm tra lần cuối: {lastCheck.toLocaleTimeString('vi-VN')}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRetry}
            disabled={isChecking}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {!isConnected && (
        <div className="mt-2 pt-2 border-t border-red-200">
          <p className="text-xs text-red-600 mb-2">
            Đang sử dụng dữ liệu local. Giá có thể không cập nhật.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full h-7 text-xs"
          >
            {isChecking ? 'Đang kiểm tra...' : 'Thử lại'}
          </Button>
        </div>
      )}
    </Card>
  )
}
