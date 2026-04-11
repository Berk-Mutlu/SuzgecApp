"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Package, 
    Trash2, 
    Clock, 
    ShoppingBag,
    ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
}

export default function StockTrackingPage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [alerts, setAlerts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState("")
    const [deleteAlertId, setDeleteAlertId] = useState<string | null>(null)

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            const user = JSON.parse(userStr)
            setUserName(`${user.firstName || ''} ${user.lastName || ''}`)
        }
        fetchAlerts()
    }, [])

    const fetchAlerts = async () => {
        try {
            const res = await api.getStockAlerts()
            setAlerts(res.data || [])
        } catch (err) {
            showToast("Stok alarmları yüklenemedi", "error")
        } finally {
            setLoading(false)
        }
    }

    const confirmDelete = async () => {
        if (!deleteAlertId) return;
        try {
            const res = await api.deleteStockAlert(deleteAlertId)
            setAlerts(prev => prev.filter(n => n._id !== deleteAlertId))
            showToast("Stok takibi iptal edildi", "success")
        } catch (err) {
            showToast("Bağlantı hatası oluştu", "error")
        } finally {
            setDeleteAlertId(null)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="h-10 w-10 border-3 border-[#6b21a8] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Yükleniyor...</p>
        </div>
    )

    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] flex items-center justify-center text-white shadow-lg shadow-suzgec-primary/20">
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Stok Takibi</h1>
                            <p className="text-xs text-muted-foreground">{userName || 'Kullanıcı'} için takip edilen ürünler</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-suzgec-primary/10 text-suzgec-primary border-0 text-[10px] h-6">
                            {alerts.length} Ürün Takipte
                        </Badge>
                    </div>
                </div>

                {}
                <div className="space-y-2">
                    {alerts.length > 0 ? (
                        <motion.div variants={container} initial="hidden" animate="show" className="space-y-1.5">
                            <AnimatePresence mode="popLayout">
                                {alerts.map((alert) => (
                                        <motion.div
                                            key={alert._id}
                                            variants={item}
                                            layout
                                            exit={{ opacity: 0, x: -20 }}
                                            onClick={() => router.push(`/urun/${alert.productId}`)}
                                            className="cursor-pointer group relative flex items-center gap-4 p-3 rounded-xl border border-transparent transition-all duration-200 hover:bg-muted/50 hover:border-border/50 bg-card shadow-sm"
                                        >
                                            <div className="h-12 w-12 rounded-lg bg-white border border-border/50 flex flex-col items-center justify-center shrink-0 overflow-hidden relative">
                                                {(alert.product?.imageUrls?.[0] || alert.product?.imageUrl) ? (
                                                    <img 
                                                        src={alert.product?.imageUrls?.[0] || alert.product?.imageUrl} 
                                                        alt={alert.product?.name || alert.productName}
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                ) : (
                                                    <Package className="h-5 w-5 text-muted-foreground opacity-50" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold truncate text-foreground">{alert.product?.name || alert.productName}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Badge variant={alert.product?.inStock ? "default" : "secondary"} className={`text-[10px] px-1.5 py-0 ${alert.product?.inStock ? "bg-suzgec-success border-0 text-white" : ""}`}>
                                                            {alert.product?.inStock ? "Stokta Var" : "Tükendi - Bekleniyor"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end md:items-center md:flex-row gap-1 md:gap-3 shrink-0">
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-muted/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: tr })}
                                                    </span>
                                                    {alert.product?.currentPrice > 0 && (
                                                        <span className="text-sm font-bold text-suzgec-primary hidden md:block">
                                                            {alert.product.currentPrice.toLocaleString("tr-TR")} ₺
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={(e) => { e.stopPropagation(); setDeleteAlertId(alert._id); }} 
                                                    title="Takipten Çık" 
                                                    className="h-8 w-8 text-muted-foreground hover:text-suzgec-danger hover:bg-suzgec-danger/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <div className="w-[1px] h-4 bg-border/60 mx-1 hidden sm:block" />
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="h-8 text-[11px] gap-1.5 border-border text-foreground hover:bg-suzgec-primary/10 hover:text-suzgec-primary transition-all shadow-sm"
                                                    asChild
                                                >
                                                    <Link href={`/urun/${alert.productId}`} onClick={(e) => e.stopPropagation()}>
                                                        <ExternalLink className="h-3.5 w-3.5" /> 
                                                        <span className="hidden sm:inline">İncele</span>
                                                    </Link>
                                                </Button>
                                            </div>
                                        </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50"><Package className="h-8 w-8 text-muted-foreground" /></div>
                            <h3 className="font-bold text-lg">Takip edilen ürün yok</h3>
                            <p className="text-sm text-muted-foreground mt-1 px-4">Stoğu tükenen ürünleri sayfasından takibe alarak stok alarmı kurabilirsiniz.</p>
                            <Button asChild className="mt-6 bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white"><Link href="/">Alışverişe Başla</Link></Button>
                        </div>
                    )}
                </div>
            </motion.div>

            {}
            <AnimatePresence>
                {deleteAlertId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setDeleteAlertId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                                    <Trash2 className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Stok Takibini İptal Et</h3>
                                <p className="text-muted-foreground text-sm mb-6">
                                    Bu ürünü stok takibinden çıkarmak istediğinize emin misiniz? Bu işlem geri alınamaz.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button variant="outline" onClick={() => setDeleteAlertId(null)}>
                                        Vazgeç
                                    </Button>
                                    <Button variant="destructive" onClick={confirmDelete}>
                                        Evet, İptal Et
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
