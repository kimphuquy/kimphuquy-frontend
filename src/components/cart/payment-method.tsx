"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Copy, CheckCircle } from "lucide-react"
import { Controller } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { PaymentMethodProps } from "./types"

export function PaymentMethod({ form }: PaymentMethodProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = form

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const selectedPaymentMethod = watch("paymentMethod")

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base sm:text-lg">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
              <div className="flex items-start space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="bank" id="bank" className="mt-1" />
                <Label htmlFor="bank" className="flex flex-col sm:flex-row sm:items-center cursor-pointer text-sm">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Chuyển khoản ngân hàng
                  </div>
                  <span className="mt-1 sm:mt-0 sm:ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block">
                    Khuyến nghị
                  </span>
                </Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>}

        {/* Bank Transfer Details */}
        {selectedPaymentMethod === "bank" && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-kpq-red dark:text-kpq-gold bg-kpq-red/10 dark:bg-kpq-gold/10 p-3 rounded-full mb-4">
                <CreditCard className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-base mb-2 text-center">Thông tin thanh toán đang được cập nhật</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                Thông tin tài khoản ngân hàng đang được cập nhật. Vui lòng liên hệ trực tiếp với cửa hàng qua số điện thoại 
                <span className="font-medium text-kpq-red dark:text-kpq-gold"> 0973.067.036 - 0879.189.363</span> để được hướng dẫn.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
