"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface MobileSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function MobileSearch({ searchTerm, onSearchChange }: MobileSearchProps) {
  return (
    <div className="lg:hidden mb-4 sm:mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          className="pl-10 h-10 sm:h-11 text-sm sm:text-base bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-kpq-red dark:focus:border-kpq-gold focus:ring-kpq-red/20 dark:focus:ring-kpq-gold/20"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
