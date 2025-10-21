export interface Store {
  id: number
  name: string
  slug: string
  address: string
  phone: string
  hours: string
  status: "Đang hoạt động" | "Tạm đóng cửa"
  type: "Cửa hàng chính" | "Chi nhánh"
  coordinates: { lat: number; lng: number }
  services: string[]
  image: string
  description?: string
  features?: string[]
  gallery?: string[]
  iframe?: string
}

// Store locations data - chỉ có 1 cửa hàng duy nhất ở Đồng Nai
export const storeLocations: Store[] = [
  {
    id: 1,
    name: "Kim Phú Quý - Cửa hàng chính tại Đồng Nai",
    slug: "dong-nai",
    address: "98/71, Tổ 39, Kp 4c, P. Trảng Dài, T. Đồng Nai",
    phone: "0973.067.036 - 0879.189.363",
    hours: "8:00 - 18:30 (Thứ 2 - Thứ 7), 8:00 - 17:00 (Chủ Nhật)",
    status: "Đang hoạt động",
    type: "Cửa hàng chính",
    coordinates: { lat: 10.9778, lng: 106.8551 },
    services: ["Mua bán trao đổi bạc", "Gia công bạc", "Tư vấn đầu tư", "Bảo hành"],
    image:
      "/images/diem ban/dong nai/z6971613995851_1fd74c45410c3f2327c557285191fbd4.jpg",
    description:
      "Kim Phú Quý Đồng Nai là cửa hàng chính của Kim Phú Quý tại Đồng Nai, chuyên mua bán phân phối bạc thỏi, bạc miếng, bạc mỹ nghệ với uy tín chất lượng hàng đầu. Phục vụ khách hàng khu vực Đồng Nai và các tỉnh lân cận.",
    features: [
      "Cửa hàng chính tại Trảng Dài, Đồng Nai",
      "Đội ngũ chuyên gia tư vấn giàu kinh nghiệm",
      "Showroom trưng bày đa dạng sản phẩm bạc",
      "Uy tín chất lượng hàng đầu về bạc miếng, bạc thỏi",
    ],
    gallery: [
      "/images/diem ban/dong nai/z6971613995851_1fd74c45410c3f2327c557285191fbd4.jpg",
      "/images/diem ban/dong nai/1.jpg",
      "/images/diem ban/dong nai/2.jpg",
      "/images/diem ban/dong nai/3.jpg",
    ],
    iframe:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.4357414069314!2d106.85261527586802!3d10.9778030523397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dd4dd309f5b1%3A0x8a5e4b5a21a3e2c3!2zVHLhuqNuZyBEw6BpLCBCaeG7gW4gSMOyYSwgxJDhu5NuZyBOYWk!5e0!3m2!1svi!2s!4v1695195157789!5m2!1svi!2s",
  },
]

// Utility functions
export const getStoreBySlug = (slug: string): Store | undefined => {
  return storeLocations.find((store) => store.slug === slug)
}

export const getActiveStores = (): Store[] => {
  return storeLocations.filter((store) => store.status === "Đang hoạt động")
}

export const getStoresByType = (type: Store["type"]): Store[] => {
  return storeLocations.filter((store) => store.type === type)
}

export const getAllDistricts = (): string[] => {
  const districts = storeLocations.map((store) => {
    // Extract district from address - this is a simple implementation
    const addressParts = store.address.split(", ")
    return addressParts[addressParts.length - 2] || "Không xác định"
  })
  return ["Tất cả", ...Array.from(new Set(districts))]
}

export const getAllStoreTypes = (): string[] => {
  const types = storeLocations.map((store) => store.type)
  return ["Tất cả", ...Array.from(new Set(types))]
}

export const getAllStatuses = (): string[] => {
  const statuses = storeLocations.map((store) => store.status)
  return ["Tất cả", ...Array.from(new Set(statuses))]
}
