"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { CartIcon } from "@/components/common/cart-icon"
import { FavoritesIcon } from "@/components/common/favorites-icon"

interface CommonHeaderProps {
  searchTerm?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
  currentPage?: string
}

export function CommonHeader({
  searchTerm = "",
  onSearchChange,
  showSearch = false,
  currentPage = "",
}: CommonHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Trang chủ", key: "home" },
    { href: "/", label: "Sản phẩm", key: "products" },
    { href: "/gia-bac-hom-nay", label: "Giá bạc hôm nay", key: "prices" },
    { href: "/diem-ban", label: "Điểm bán", key: "stores" },
    { href: "/lien-he", label: "Liên hệ", key: "contact" },
  ]

  const isCurrentPage = (key: string) => {
    return currentPage === key
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-kpq-red dark:bg-kpq-darkred text-white shadow-lg">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src="/avt_nls_phuquy_logo_2_rounded.png"
              alt="Kim Phú Quý"
              width={32}
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <div className="hidden xs:block sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-kpq-gold">KIM PHÚ QUÝ</h1>
              <p className="text-xs sm:text-sm text-white">99'99</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`hover:text-kpq-gold dark:hover:text-kpq-gold transition-colors ${
                  isCurrentPage(item.key) ? "text-kpq-gold font-medium" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search, Theme Toggle, Favorites & Cart */}
          <div className="flex items-center space-x-4">
            {showSearch && onSearchChange && (
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-10 w-64 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-kpq-red dark:focus:border-kpq-gold focus:ring-kpq-red/20 dark:focus:ring-kpq-gold/20"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>
              </div>
            )}
            <ThemeToggle />
            <FavoritesIcon />
            <CartIcon />

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-kpq-red dark:bg-kpq-darkred text-white px-0 pt-0">
                <SheetHeader>
                  <SheetTitle className="text-kpq-gold px-6 pt-6 pb-2 pl-2 text-lg font-bold">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col mt-2">
                  {navItems.map((item, idx) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={`text-base px-6 py-4 border-b border-kpq-darkred text-left hover:bg-kpq-darkred dark:hover:bg-kpq-red transition-colors ${
                        isCurrentPage(item.key) ? "text-kpq-gold font-semibold" : "text-white"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
