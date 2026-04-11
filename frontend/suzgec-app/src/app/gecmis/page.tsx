"use client"

import { motion } from "framer-motion"
import { History, Search, ExternalLink, Clock, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"

export default function GecmisPage() {
    const [filter, setFilter] = useState("")
    const [searchHistory, setSearchHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.getSearchHistory()
            .then((data) => {
                const items = Array.isArray(data) ? data : (data.data || [])
                setSearchHistory(items)
            })
            .catch((err) => {
                console.error('Search history fetch error:', err)
            })
            .finally(() => setLoading(false))
    }, [])

    const filtered = searchHistory.filter((item) =>
        (item.query || '').toLowerCase().includes(filter.toLowerCase())
    )

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        
        if (diffDays === 0) return `Bugün, ${timeStr}`
        if (diffDays === 1) return `Dün, ${timeStr}`
        return `${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}, ${timeStr}`
    }

    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] flex items-center justify-center">
                        <History className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Arama Geçmişi</h1>
                        <p className="text-sm text-muted-foreground">{searchHistory.length} arama kaydı</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                    Geçmişi Temizle
                </Button>
            </motion.div>

            {}
            <div className="relative mb-5 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Geçmişte ara..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 h-9"
                />
            </div>

            {}
            <div className="space-y-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mb-2" />
                        <span className="text-sm">Arama geçmişi yükleniyor...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <Search className="h-8 w-8 mb-2 opacity-40" />
                        <span className="text-sm">Henüz arama geçmişi bulunmuyor</span>
                    </div>
                ) : (
                    filtered.map((item, i) => (
                        <motion.div
                            key={item._id || item.id || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <Link href={`/arama?q=${encodeURIComponent(item.query)}`}>
                                <Card className="p-4 flex items-center justify-between hover:border-suzgec-primary/30 hover:shadow-sm transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium group-hover:text-suzgec-primary transition-colors">{item.query}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {formatDate(item.createdAt || item.updatedAt)}
                                                </span>
                                                {item.category && (
                                                    <Badge variant="secondary" className="text-[10px] h-4">{item.category}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{item.resultCount || 0} sonuç</span>
                                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-suzgec-primary transition-colors" />
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
