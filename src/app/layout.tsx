import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ApiStatus } from "@/components/common/api-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kim Phú Quý - Bạc Kim Phú Quý Đồng Nai | Kim Phú Quý",
  description:
    "Cửa hàng Kim Phú Quý Đồng Nai chính thức. Chuyên mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ. Hotline: 0973.067.036 - 0879.189.363. Địa chỉ: 98/71, Tổ 39, Kp 4c, P. Trảng Dài, T. Đồng Nai.",
  keywords: [
    "bạc kim phú quý đồng nai",
    "kim phú quý đồng nai", 
    "cửa hàng bạc kim phú quý đồng nai",
    "bạc kim phú quý tại đồng nai",
    "mua bạc kim phú quý đồng nai",
    "bán bạc kim phú quý đồng nai",
    "cửa hàng kim phú quý đồng nai",
    "cửa hàng bạc kim phú quý đồng nai",
    "bạc miếng kim phú quý đồng nai",
    "bạc thỏi kim phú quý đồng nai",
    "đầu tư bạc đồng nai",
    "bạc tích trữ đồng nai",
    "mua bán bạc đồng nai",
    "đầu tư kim loại quý đồng nai",
    "bạc 9999 đồng nai",
    "bạc 999 đồng nai",
    "kim phú quý đồng nai",
    "cửa hàng bạc đồng nai",
    "bạc trang sức đồng nai",
    "bạc mỹ nghệ đồng nai",
  ].join(", "),
  authors: [{ name: "Công Ty TNHH Kim Phú Quý" }],
  creator: "Công Ty TNHH Kim Phú Quý",
  publisher: "Công Ty TNHH Kim Phú Quý",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://kimphuquy.com",
    siteName: "Công Ty TNHH Kim Phú Quý",
    title: "Kim Phú Quý - Bạc Kim Phú Quý Đồng Nai",
    description:
      "Cửa hàng Kim Phú Quý Đồng Nai chính thức, huyên mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ. Hotline: 0973.067.036 - 0879.189.363 | Địa chỉ: 98/71, Tổ 39, Kp 4c, P. Trảng Dài, T. Đồng Nai",
    images: [
      {
        url: "/cover fanpage nls phu quy 2.png",
        width: 1200,
        height: 630,
        alt: "Bạc Kim Phú Quý Đồng Nai - Kim Phú Quý",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kim Phú Quý - Bạc Kim Phú Quý Đồng Nai",
    description: "Cửa hàng Kim Phú Quý Đồng Nai chính thức, huyên mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ. Hotline: 0973.067.036 - 0879.189.363 | Địa chỉ: 98/71, Tổ 39, Kp 4c, P. Trảng Dài, T. Đồng Nai",
    images: [
      "/cover fanpage nls phu quy 2.png",
    ],
  },
  alternates: {
    canonical: "https://kimphuquy.com",
  },
  category: "Đầu tư kim loại quý",
  classification: "Business",
  other: {
    "geo.region": "VN-39",
    "geo.placename": "Đồng Nai",
    "geo.position": "10.9778;106.8551",
    ICBM: "10.9778, 106.8551",
  },
  icons: {
    icon: "/avt_nls_phuquy_logo_2_rounded.png",
    shortcut:
      "/avt_nls_phuquy_logo_2_rounded.png",
    apple:
      "/avt_nls_phuquy_logo_2_rounded.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <link rel="icon" type="image/png" href="/avt_nls_phuquy_logo_2_rounded.png"></link>
      <link rel="icon" type="image/png" sizes="192x192" href="/avt_nls_phuquy_logo_2_rounded.png"></link>
      <link rel="apple-touch-icon" href="/avt_nls_phuquy_logo_2_rounded.png"></link>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          {children}
          <ApiStatus />
        </ThemeProvider>
      </body>
    </html>
  )
}
