"use client"

import { motion } from "framer-motion"
import { Package, Sparkles } from "lucide-react"
import { ProductCard } from "@/components/shared/product-card"
import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { api } from "@/lib/api"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
}

const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
}

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || "telefon"
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        setIsLoading(true)
        api.searchProducts(query === "all" ? "" : query).then(res => {
            const data = (res.data || (Array.isArray(res) ? res : []))
                .filter((p: any) => p.name && p.name.trim().length > 3)
                
                .filter((p: any) => p.condition !== 'used')
            setFeaturedProducts(data)
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }, [query])

    if (isLoading) {
        return (
            <div className="px-4 py-32 text-center max-md:py-8 max-md:min-h-[60vh] max-md:flex max-md:items-center max-md:justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center gap-5 max-w-md mx-auto"
                >
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full border-4 border-[#6b21a8]/20 border-t-[#6b21a8] animate-spin"></div>
                        <Sparkles className="h-6 w-6 text-[#6b21a8] absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold tracking-tight">Ürünler Taranıyor...</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            En güncel fiyatlar ve mağaza stokları kontrol ediliyor.{"\n"}Lütfen bekleyin...
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="px-4 sm:px-6 py-8 pb-20">
            {}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-5 w-5 text-[#6b21a8]" />
                    <h1 className="text-2xl font-bold tracking-tight">
                        &ldquo;{query}&rdquo; için sonuçlar
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground ml-7">
                    {featuredProducts.length} adet ürün bulundu
                </p>
            </motion.div>

            {}
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5"
            >
                {featuredProducts.map((product, i) => (
                    <motion.div 
                        key={product._id || product.id || i}
                        variants={item}
                    >
                        <ProductCard product={product} index={i} />
                    </motion.div>
                ))}
            </motion.div>

            {}
            {featuredProducts.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Package className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Ürün Bulunamadı</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                        Aradığınız kriterlere uygun sıfır ürün bulunamadı. Lütfen farklı bir kelime deneyin.
                    </p>
                </div>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="px-4 py-32 text-center flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 border-4 border-[#6b21a8]/20 border-t-[#6b21a8] animate-spin rounded-full"></div>
                <p className="text-muted-foreground animate-pulse font-medium">Başlatılıyor...</p>
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}
