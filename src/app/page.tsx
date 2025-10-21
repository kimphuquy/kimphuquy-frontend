"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CommonHeader } from "@/components/common/common-header"
import { CommonFooter } from "@/components/common/common-footer"
import { FloatingContact } from "@/components/common/floating-contact"
import { HeroSection } from "@/components/home/hero-section"
import { MobileSearch } from "@/components/home/mobile-search"
import { ActiveFiltersDisplay } from "@/components/home/active-filters-display"
import { FiltersSection } from "@/components/home/filters-section"
import { ProductGrid } from "@/components/home/product-grid"
import { Pagination } from "@/components/home/pagination"
import { FAQSection } from "@/components/home/faq-section"
import { PriceUpdateIndicator } from "@/components/common/price-update-indicator"
import { PriceCrawlerTest } from "@/components/common/price-crawler-test"
import {
  refreshProductsFromStorage,
  getAllBrands,
  getAllPriceRanges,
  getAllCategories,
  getAllStatuses,
  getPriceRange,
  forceRefreshFromJSON,
} from "@/data/products"
import { usePriceUpdater } from "@/hooks/use-price-updater"

interface FilterState {
  brands: string[]
  priceRanges: string[]
  silverTypes: string[]
  statuses: string[]
  showPromotions: boolean
}

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRanges: [],
    silverTypes: [],
    statuses: [],
    showPromotions: false,
  })
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState(() => refreshProductsFromStorage())
  const itemsPerPage = 12
  const [activeBrandTab, setActiveBrandTab] = useState<string>("phu-quy")

  const { checkAndUpdateIfNeeded } = usePriceUpdater()

  // Initialize state from URL parameters
  useEffect(() => {
    const page = searchParams.get('page')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    
    if (page) {
      const pageNum = parseInt(page, 10)
      if (pageNum > 0) {
        setCurrentPage(pageNum)
      }
    }
    
    if (brand && ['phu-quy', 'ancarat', 'kim-phu-quy'].includes(brand)) {
      setActiveBrandTab(brand)
    }
    
    if (search) {
      setSearchTerm(decodeURIComponent(search))
    }
  }, [searchParams])

  // Update URL when state changes
  const updateURL = (page: number, brandTab: string, searchTerm: string) => {
    const params = new URLSearchParams()
    
    if (page > 1) {
      params.set('page', page.toString())
    }
    
    if (brandTab !== 'phu-quy') {
      params.set('brand', brandTab)
    }
    
    if (searchTerm.trim()) {
      params.set('search', encodeURIComponent(searchTerm.trim()))
    }
    
    const newURL = params.toString() ? `/?${params.toString()}` : '/'
    router.replace(newURL, { scroll: false })
  }

  // Scroll to filters section
  const scrollToFilters = () => {
    const filtersElement = document.getElementById('filters-section')
    if (filtersElement) {
      filtersElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  // Refresh products when component mounts and after updates
  useEffect(() => {
    const refreshProducts = () => {
      const updatedProducts = refreshProductsFromStorage()
      setProducts(updatedProducts)
    }

    // Initial load - this will automatically check and update from JSON if needed
    refreshProducts()

    // Listen for storage changes (when prices are updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kim-phu-quy-products-updated" || e.key === "kim-phu-quy-products-initial") {
        console.log("Products updated in localStorage, refreshing...")
        const updatedProducts = refreshProductsFromStorage()
        setProducts(updatedProducts)
        console.log("Updated products count:", updatedProducts.length)
      }
    }

    // Listen for localStorage refresh events
    const handleLocalStorageRefresh = () => {
      console.log("LocalStorage refresh triggered, updating products...")
      const refreshedProducts = refreshProductsFromStorage()
      setProducts(refreshedProducts)
      console.log("Refreshed products count:", refreshedProducts.length)
    }

    // Listen for price update events
    const handlePricesUpdated = () => {
      console.log("Prices updated event triggered, refreshing products...")
      const refreshedProducts = refreshProductsFromStorage()
      setProducts(refreshedProducts)
      console.log("Price updated products count:", refreshedProducts.length)
    }

    // Listen for keyboard shortcut to force refresh from JSON (for development)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "R") {
        e.preventDefault()
        console.log("Force refreshing from JSON...")
        const freshProducts = forceRefreshFromJSON()
        setProducts(freshProducts)
        console.log("Force refreshed products count:", freshProducts.length)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("localStorageRefresh", handleLocalStorageRefresh)
    window.addEventListener("pricesUpdated", handlePricesUpdated)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("localStorageRefresh", handleLocalStorageRefresh)
      window.removeEventListener("pricesUpdated", handlePricesUpdated)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Get dynamic filter options based on current products
  const brands = getAllBrands()
  const priceRanges = getAllPriceRanges()
  const silverTypes = getAllCategories()
  const statuses = getAllStatuses()

  // Load filters from localStorage on component mount
  useEffect(() => {
    const savedFilters = localStorage.getItem("kim-phu-quy-filters")
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters)
        setFilters(parsedFilters)
      } catch (error) {
        console.error("Error loading filters from localStorage:", error)
      }
    }
  }, [])

  // Save filters to localStorage whenever filters change
  useEffect(() => {
    localStorage.setItem("kim-phu-quy-filters", JSON.stringify(filters))
  }, [filters])

  // Update URL when page, brand tab, or search changes
  useEffect(() => {
    updateURL(currentPage, activeBrandTab, searchTerm)
  }, [currentPage, activeBrandTab, searchTerm])

  // Auto-check and update prices every 1 minute
  useEffect(() => {
    // Initial check after 3 seconds
    const initialTimer = setTimeout(() => {
      checkAndUpdateIfNeeded(products).catch((error) => {
        console.error("Initial price update failed:", error)
      })
    }, 3000)

    // Then check every 1 minute
    const interval = setInterval(() => {
      checkAndUpdateIfNeeded(products).catch((error) => {
        console.error("Periodic price update failed:", error)
      })
    }, 60000) // 1 minute

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [checkAndUpdateIfNeeded]) // Remove products dependency to avoid recreating interval

  const handleBrandChange = (brand: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      brands: checked ? [...prev.brands, brand] : prev.brands.filter((b) => b !== brand),
    }))
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (priceRange: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      priceRanges: checked ? [...prev.priceRanges, priceRange] : prev.priceRanges.filter((p) => p !== priceRange),
    }))
    setCurrentPage(1)
  }

  const handleSilverTypeChange = (silverType: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      silverTypes: checked ? [...prev.silverTypes, silverType] : prev.silverTypes.filter((s) => s !== silverType),
    }))
    setCurrentPage(1)
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      statuses: checked ? [...prev.statuses, status] : prev.statuses.filter((s) => s !== status),
    }))
    setCurrentPage(1)
  }

  const handlePromotionChange = (checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      showPromotions: checked,
    }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      priceRanges: [],
      silverTypes: [],
      statuses: [],
      showPromotions: false,
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to filters section when changing pages
    setTimeout(() => {
      scrollToFilters()
    }, 100)
  }

  const handleBrandTabChange = (brandTab: string) => {
    setActiveBrandTab(brandTab)
    setCurrentPage(1)
    // Scroll to filters section when changing brand tabs
    setTimeout(() => {
      scrollToFilters()
    }, 100)
  }

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
    setCurrentPage(1)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand)
    const matchesPriceRange =
      filters.priceRanges.length === 0 || filters.priceRanges.includes(getPriceRange(product.sellPrice))
    const matchesSilverType = filters.silverTypes.length === 0 || filters.silverTypes.includes(product.category)
    const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(product.status)

    // Brand tab filtering
    const matchesBrandTab =
      activeBrandTab === "all" ||
      (activeBrandTab === "phu-quy" && product.brand !== "Ancarat" && product.brand !== "Kim Phú Quý") ||
      (activeBrandTab === "ancarat" && product.brand === "Ancarat") ||
      (activeBrandTab === "kim-phu-quy" && product.brand === "Kim Phú Quý")

    return matchesSearch && matchesBrand && matchesPriceRange && matchesSilverType && matchesStatus && matchesBrandTab
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.sellPrice - b.sellPrice
      case "price-high":
        return b.sellPrice - a.sellPrice
      case "name":
        return a.name.localeCompare(b.name)
      case "newest":
      default:
        // Sắp xếp theo ngày tạo (mới nhất trước)
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    }
  })

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Công Ty TNHH Kim Phú Quý",
    description: "Cửa hàng Kim Phú Quý Đồng Nai chính thức, chuyên mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ tại Đồng Nai, đầu tư bạc tích trữ uy tín, an toàn. Hotline: 0973.067.036 - 0879.189.363 | Địa Chỉ: 98/71, Tổ 39, Kp 4c, P. Trảng Dài, T. Đồng Nai",
    url: "https://kimphuquy.com",
    telephone: "+84973067036",
    address: {
      "@type": "PostalAddress",
      streetAddress: "98/71, Tổ 39, Kp 4c, P. Trảng Dài",
      addressLocality: "Biên Hòa",
      addressRegion: "Đồng Nai",
      postalCode: "810000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.9778,
      longitude: 106.8551,
    },
    openingHours: "Mo-Sa 08:00-18:00",
    priceRange: "$$",
    image: "/cover fanpage nls phu quy 2.png",
    sameAs: ["https://facebook.com/kimphuquy", "https://zalo.me/kimphuquy"],
    serviceType: "Mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ",
    areaServed: {
      "@type": "City",
      name: "Đồng Nai",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dịch vụ mua bán bạc",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mua bán phân phối bạc miếng",
            description: "Dịch vụ mua bán phân phối bạc miếng uy tín chất lượng",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mua bán phân phối bạc thỏi",
            description: "Dịch vụ mua bán phân phối bạc thỏi chất lượng cao",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mua bán phân phối bạc mỹ nghệ",
            description: "Dịch vụ mua bán phân phối bạc mỹ nghệ uy tín chất lượng",
          },
        },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {/* Header */}
      <CommonHeader searchTerm={searchTerm} onSearchChange={handleSearchChange} showSearch={true} currentPage="home" />

      {/* Spacer for fixed header */}
      <div className="h-14 sm:h-16"></div>

      {/* Page H1 for SEO (visually hidden) */}
      <h1 className="sr-only">Kim Phú Quý Đồng Nai - Mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ</h1>

      {/* Hero Section */}
      <HeroSection />

      {/* Order feature notice */}
      <div className="w-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 text-center py-2 px-4 text-sm font-medium">
      Tính năng đặt hàng trên website chưa chính thức mở, vui lòng nhắn qua <a href="https://zalo.me/0973067036" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Zalo 0973 067 036</a> hoặc <a href="https://www.facebook.com/bacphuquydongnai" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Fanpage</a> để được đặt hàng giá chính xác nhất.
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Mobile Search */}
        <MobileSearch searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        {/* Brand Tabs */}
        <div id="filters-section" className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 shadow-sm border dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBrandTabChange("phu-quy")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeBrandTab === "phu-quy"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Phú Quý
            </button>
            <button
              onClick={() => handleBrandTabChange("ancarat")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeBrandTab === "ancarat"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Ancarat
            </button>
            <button
              onClick={() => handleBrandTabChange("kim-phu-quy")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeBrandTab === "kim-phu-quy"
                  ? "bg-kpq-blue text-kpq-yellow"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Kim Phú Quý
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        <ActiveFiltersDisplay filters={filters} onClearFilters={clearAllFilters} />

        {/* Filters Section */}
        <FiltersSection
          filters={filters}
          brands={brands}
          priceRanges={priceRanges}
          silverTypes={silverTypes}
          statuses={statuses}
          sortBy={sortBy}
          onBrandChange={handleBrandChange}
          onPriceRangeChange={handlePriceRangeChange}
          onSilverTypeChange={handleSilverTypeChange}
          onStatusChange={handleStatusChange}
          onPromotionChange={handlePromotionChange}
          onSortChange={setSortBy}
        />

        {/* Products Grid */}
        <ProductGrid products={currentProducts} />

        {/* Pagination */}
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>

        {/* Development Helper */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
            Press Ctrl+Shift+R to force refresh from JSON
          </div>
        )}
      </main>

      {/* SEO Content Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6 text-center">
                Công Ty TNHH Kim Phú Quý - Chuyên Mua Bán Phân Phối Bạc Thỏi, Bạc Miếng, Bạc Mỹ Nghệ Uy Tín Tại Đồng Nai
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Kim Phú Quý - Mua Bán Phân Phối Bạc Thỏi, Bạc Miếng, Bạc Mỹ Nghệ Uy Tín Chất Lượng
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Là cửa hàng chuyên mua bán phân phối <span className="font-semibold">bạc thỏi, bạc miếng, bạc mỹ nghệ</span> tại Đồng Nai, chúng tôi tự hào cung cấp những sản phẩm bạc chất lượng tốt nhất. 
                    Bạc tại cửa hàng có độ tinh khiết 999, được phân phối theo tiêu chuẩn quốc tế. Xem <a className="underline" href="/gia-bac-hom-nay">giá bạc hôm nay</a> để cập nhật.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    <span className="font-semibold">Kim Phú Quý</span> là thương hiệu uy tín trong lĩnh vực mua bán bạc, và chúng tôi cam kết mang đến những sản phẩm chất lượng cao nhất cho khách hàng. Cần hỗ trợ? Ghé <a className="underline" href="/lien-he">liên hệ</a> ngay.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Dịch Vụ Mua Bán Phân Phối Bạc Thỏi, Bạc Miếng, Bạc Mỹ Nghệ Tại Đồng Nai
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Với kinh nghiệm trong lĩnh vực mua bán bạc, Kim Phú Quý cung cấp dịch vụ tư vấn chuyên nghiệp. 
                    Bạc miếng, bạc thỏi, bạc mỹ nghệ là lựa chọn lý tưởng cho việc đầu tư dài hạn. Xem <a className="underline" href="/chinh-sach/bao-hanh">chính sách bảo hành</a> và <a className="underline" href="/chinh-sach/bao-mat">bảo mật</a>.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Chúng tôi cũng cung cấp dịch vụ mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ tại Đồng Nai với giá cả cạnh tranh, minh bạch, đảm bảo quyền lợi tối đa cho khách hàng. Xem <a className="underline" href="/diem-ban">điểm bán</a> gần bạn.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Tại Sao Chọn Kim Phú Quý Đồng Nai?
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 mt-1">✓</span>
                    <span>Công ty TNHH Kim Phú Quý chính thức với đầy đủ giấy phép kinh doanh</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 mt-1">✓</span>
                    <span>Bạc thỏi, bạc miếng tại Đồng Nai chất lượng 999, uy tín chất lượng</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 mt-1">✓</span>
                    <span>Kim Phú Quý - thương hiệu uy tín, được khách hàng tin cậy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 mt-1">✓</span>
                    <span>Dịch vụ mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ chuyên nghiệp</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 mt-1">✓</span>
                    <span>Giá cả cạnh tranh, minh bạch, không phát sinh phí ẩn</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  <strong>Địa chỉ Kim Phú Quý Đồng Nai:</strong> 98/71, Tổ 39, Kp 4c, P. Trảng Dài, T. Đồng Nai
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <strong>Hotline:</strong> 0973.067.036 - 0879.189.363 {/* - <strong>Email:</strong> kimphuquy@gmail.com */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Crawler Test - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <PriceCrawlerTest />
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <CommonFooter />

      {/* Floating Contact Widget */}
      <FloatingContact />

      {/* Price Update Indicator (hidden by default) */}
      <PriceUpdateIndicator />
    </div>
  )
}
