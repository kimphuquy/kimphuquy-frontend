import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-kpq-darkred via-kpq-darkred to-kpq-red dark:from-kpq-darkred dark:via-black dark:to-kpq-darkred text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-kpq-gold/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-red-800/10 to-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-kpq-gold/5 to-transparent -skew-x-12 animate-shimmer"></div>

        {/* Floating Particles */}
        <div className="absolute top-1/3 left-1/6 w-2 h-2 bg-kpq-gold/30 rounded-full animate-float"></div>
        <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-kpq-gold/20 rounded-full animate-float delay-500"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/15 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-kpq-gold/20 rounded-full animate-float delay-1500"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-kpq-gold via-yellow-300 to-kpq-gold bg-clip-text text-transparent animate-fade-in">
            Bạc Thỏi - Bạc Miếng - Bạc Mỹ Nghệ
          </h2>
          <p className="text-lg sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 animate-fade-in delay-300 max-w-3xl mx-auto">
            Chuyên mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ tại Đồng Nai
          </p>
          <p className="text-base sm:text-lg md:text-xl text-kpq-gold mb-8 sm:mb-12 animate-fade-in delay-500 max-w-2xl mx-auto">
            Uy tín chất lượng - Bạc miếng, bạc thỏi, bạc mỹ nghệ chất lượng 999, đầu tư bạc tích trữ an toàn
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in delay-700">
            <Button
              size="lg"
              className="bg-gradient-to-r from-kpq-gold to-yellow-500 text-black hover:from-yellow-500 hover:to-kpq-gold text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Xem Sản Phẩm
            </Button>
            <Link href="/lien-he">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-kpq-gold text-kpq-gold hover:bg-kpq-gold/10 hover:text-white bg-transparent backdrop-blur-sm text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Liên Hệ Tư Vấn
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 animate-fade-in delay-1000">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-kpq-gold mb-2">999</div>
              <div className="text-sm sm:text-base text-white">Độ Tinh Khiết</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">UY TÍN</div>
              <div className="text-sm sm:text-base text-kpq-gold">Chất Lượng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-kpq-gold mb-2">100%</div>
              <div className="text-sm sm:text-base text-white">Đảm Bảo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
