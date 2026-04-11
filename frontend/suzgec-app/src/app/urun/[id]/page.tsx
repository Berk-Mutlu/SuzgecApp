import { ProductDetailClient } from "@/components/product/ProductDetailClient"
export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <ProductDetailClient params={params} />
}
