"use client"

import { motion } from "framer-motion"
import { Search, TrendingDown, ArrowRight, Zap, Eye, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ProductCard } from "@/components/shared/product-card"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    setProductsLoading(true)
    api.searchProducts("", 50).then(res => {
      const data = res.data || (Array.isArray(res) ? res : [])
      setFeaturedProducts(data);
    }).catch(console.error).finally(() => setProductsLoading(false));

    const fetchHistory = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        api.getSearchHistory().then(res => {
          const data = res.data || (Array.isArray(res) ? res : [])
          if (data.length > 0) {
            setRecentSearches(data.slice(0, 5).map((d: any) => d.query));
          }
        }).catch(console.error);
      } else {
        const localHistory = localStorage.getItem('guest_search_history')
        if (localHistory) setRecentSearches(JSON.parse(localHistory))
      }
    }

    fetchHistory()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const q = searchQuery.trim()
      setShowHistory(false)

      const token = localStorage.getItem('token')
      if (!token) {
        const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('guest_search_history', JSON.stringify(updated))
      }

      router.push(`/arama?q=${encodeURIComponent(q)}`)
    }
  }

  const handleHistoryClick = (query: string) => {
    setShowHistory(false)
    router.push(`/arama?q=${encodeURIComponent(query)}`)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredHistory = searchQuery.trim()
    ? recentSearches.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : recentSearches

  return (
    <div className="pb-12">
      {}
      <section className="relative z-30">
        <div className="absolute inset-0 bg-gradient-to-br from-suzgec-primary/10 via-suzgec-secondary/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-suzgec-primary/8 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 max-md:pt-8 max-md:pb-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 max-md:text-[2rem] max-md:leading-tight max-md:mb-3 max-md:font-extrabold"
          >
            En Uygun Fiyatı{" "}
            <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6]">
              SüzGeç
            </span>&apos;le Bul
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg mb-8 max-w-2xl mx-auto max-md:text-sm max-md:mb-4"
          >
            Binlerce siteden milyonlarca ürünü aynı anda ara,
            fiyatları karşılaştır, takip et ve en iyi fırsatı yakala.
          </motion.p>

          {}
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative z-20"
          >
            <form onSubmit={handleSearch}>
              <div className="relative flex shadow-xl shadow-suzgec-primary/10 rounded-2xl border border-border/60 bg-card overflow-hidden">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ne aramıştınız? (ör. iPhone 15, MacBook Air)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowHistory(true)}
                    className="h-13 pl-12 pr-4 border-0 shadow-none focus-visible:ring-0 text-base bg-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-10 px-6 my-1.5 mr-1.5 rounded-xl bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:opacity-90 text-white font-medium shrink-0 shadow-[0_4px_14px_0_rgba(107,33,168,0.25)]"
                >
                  <Search className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Ara</span>
                </Button>
              </div>
            </form>

            {}
            {showHistory && filteredHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-3.5 py-2 border-b border-border/50">
                  <p className="text-[11px] text-muted-foreground font-medium">Son Aramalar</p>
                </div>
                {filteredHistory.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => handleHistoryClick(query)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                  >
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{query}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 py-10 overflow-hidden max-md:hidden">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {[
            { icon: Zap, title: "Ara & Karşılaştır", desc: "Tüm sitelerdeki fiyatları tek arama ile gör", color: "from-yellow-500 to-orange-500" },
            { icon: Eye, title: "Takip Et", desc: "Fiyat hedefi belirle, düştüğünde haber al", color: "from-[#6b21a8] via-[#4f46e5] to-[#3b82f6]" },
            { icon: Bell, title: "Tasarruf Et", desc: "Stok & fiyat alarmlarıyla en iyi anı yakala", color: "from-green-500 to-emerald-500" },
          ].map((step, i) => (
            <motion.div key={i} variants={item}>
              <Card className="p-8 text-center border-border/50 hover:border-[#6b21a8]/20 hover:shadow-lg transition-all duration-300 bg-card/50 flex flex-col items-center justify-center h-full min-h-[220px]">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md mb-4`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {}
      <section className="px-4 sm:px-6 pb-8">
        <div className="flex items-center gap-2 mb-5">
          <TrendingDown className="h-5 w-5 text-suzgec-success" />
          <h2 className="text-lg font-bold">Günün Fırsatları</h2>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredProducts.slice(0, 50).map((product, i) => (
                <ProductCard key={product._id || product.id || i} product={product} index={i} />
              ))}
            </div>

            {featuredProducts.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button
                  asChild
                  className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:opacity-90 text-white font-semibold shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] hover:shadow-[0_6px_20px_rgba(107,33,168,0.4)] transition-all"
                >
                  <Link href="/firsatlar" className="flex items-center gap-2">
                    Daha Fazla Fırsat
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
