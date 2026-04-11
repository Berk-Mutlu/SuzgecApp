"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { TrendingDown, Zap, SearchX, ChevronLeft, ChevronRight } from "lucide-react"
import { api } from "@/lib/api"
import { ProductCard } from "@/components/shared/product-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

function ProductSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden animate-pulse">
      <div className="h-[160px] bg-muted/60" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted/60 rounded w-full" />
        <div className="h-3 bg-muted/60 rounded w-3/4" />
        <div className="h-2 bg-muted/40 rounded w-1/2 mt-1" />
        <div className="h-4 bg-muted/60 rounded w-1/3 mt-2" />
        <div className="flex gap-2 mt-3">
          <div className="h-8 w-8 bg-muted/50 rounded-lg" />
          <div className="h-8 w-8 bg-muted/50 rounded-lg" />
          <div className="h-8 flex-1 bg-muted/50 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function FirsatlarPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageLoading, setPageLoading] = useState(false)
  const hasFetched = useRef(false)

  const fetchDeals = async (pageNum: number, isInitial: boolean = false) => {
    if (isInitial) {
      setLoading(true)
    } else {
      setPageLoading(true)
    }

    try {
      const res = await api.searchProducts("", 50, pageNum)
      const dataArray = Array.isArray(res) ? res : (res.data || [])
      setProducts(dataArray)
    } catch (err) {
      console.error("Fırsatlar yüklenemedi:", err)
    } finally {
      setLoading(false)
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    window.scrollTo({ top: 0, behavior: "instant" })
    fetchDeals(1, true)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || pageLoading) return
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "instant" })
    fetchDeals(newPage)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <section className="bg-muted/30 border-b border-border/50 py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <TrendingDown className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Günün Fırsatları</h1>
              <p className="text-muted-foreground mt-1">Sizin için seçilen anlık en büyük indirimler ve trend ürünler</p>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {}
      <section className="bg-muted/30 border-b border-border/50 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex items-center gap-4"
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <TrendingDown className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Günün Fırsatları</h1>
              <p className="text-muted-foreground mt-1">Sizin için seçilen anlık en büyük indirimler ve trend ürünler</p>
            </div>
          </motion.div>
        </div>
      </section>

      {}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {pageLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div
            key={page}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            {products.map((product, index) => (
              <ProductCard key={product._id || product.id || index} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border border-dashed border-border/60 rounded-3xl text-center px-4">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchX className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-bold mb-2">Şu an fırsat bulunamadı</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Veritabanımızda henüz bir fırsat listelenmiyor. Lütfen daha sonra tekrar kontrol edin.
            </p>
            <Button asChild className="bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white hover:opacity-90">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </div>
        )}

        {}
        {products.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 mt-10"
          >
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || pageLoading}
              className="h-11 px-5 rounded-xl border-border/60 hover:border-suzgec-primary/40 hover:text-suzgec-primary transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4 mr-1.5" />
              Önceki
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={pageLoading}
                    className={`h-10 w-10 rounded-lg text-sm font-semibold transition-all ${
                      page === pageNum 
                        ? 'bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white shadow-[0_4px_14px_0_rgba(107,33,168,0.25)]' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= 5 || pageLoading}
              className="h-11 px-5 rounded-xl border-border/60 hover:border-suzgec-primary/40 hover:text-suzgec-primary transition-all disabled:opacity-30"
            >
              Sonraki
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          </motion.div>
        )}
      </section>
    </div>
  )
}
