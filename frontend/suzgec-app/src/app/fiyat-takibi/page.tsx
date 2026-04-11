"use client"

import { motion } from "framer-motion"
import { Bell, BellRing, Trash2, Plus, TrendingDown, Target, ToggleLeft, ToggleRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/mock-data"
import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/context/ToastContext"
import { AddPriceAlertDialog } from "@/components/alerts/AddPriceAlertDialog"

export default function PriceAlarmsPage() {
    const { showToast } = useToast()
    const [alarms, setAlarms] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingAlarm, setEditingAlarm] = useState<any>(null)
    const [alarmToDelete, setAlarmToDelete] = useState<any>(null)

    const fetchAlarms = () => {
        setLoading(true)
        api.getPriceAlerts().then(res => {
            const data = res.data || (Array.isArray(res) ? res : [])
            setAlarms(data)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchAlarms()
    }, [])

    const toggleAlarm = async (id: string, currentStatus: boolean) => {
        setAlarms(prev => prev.map(a => a._id === id ? { ...a, enabled: !currentStatus } : a))

        try {
            const res = await api.updatePriceAlert(id, { enabled: !currentStatus })
            if (!res.success) {
                setAlarms(prev => prev.map(a => a._id === id ? { ...a, enabled: currentStatus } : a))
                showToast("İşlem başarısız oldu", "error")
            } else {
                showToast(!currentStatus ? "Alarm etkinleştirildi" : "Alarm pasifleştirildi", "success")
            }
        } catch (err) {
            setAlarms(prev => prev.map(a => a._id === id ? { ...a, enabled: currentStatus } : a))
            showToast("Bağlantı hatası", "error")
        }
    }

    const deleteAlarm = async (id: string) => {
        setLoading(true)
        try {
            const res = await api.deletePriceAlert(id)
            if (res.success) {
                showToast("Alarm silindi", "success")
                setAlarmToDelete(null)
                fetchAlarms()
            }
        } catch (err) {
            showToast("Hata oluştu", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] flex items-center justify-center">
                        <BellRing className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Fiyat Alarmları</h1>
                        <p className="text-xs text-muted-foreground">Toplam {alarms.length} takip edilen ürün</p>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                        <div className="h-10 w-10 border-3 border-[#6b21a8] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground animate-pulse">Yükleniyor...</p>
                    </div>
                ) : alarms.map((alarm, i) => {
                    const product = alarm.product || {}
                    const currentPrice = alarm.currentPrice || product.currentPrice || 0
                    const priceDiff = currentPrice - alarm.targetPrice
                    const pricePct = currentPrice > 0 ? ((priceDiff / currentPrice) * 100).toFixed(1) : "0"
                    const isClose = priceDiff > 0 && priceDiff / currentPrice < 0.1
                    const isEnabled = alarm.enabled !== false

                    return (
                        <motion.div
                            key={alarm._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <Card className={`p-4 max-md:p-3 transition-all hover:border-[#6b21a8]/20 ${isEnabled ? "border-border/50" : "border-border/30 opacity-60"}`}>
                                <div className="flex items-center gap-4 max-md:flex-col max-md:items-stretch max-md:gap-3">
                                    <Link
                                        href={`/urun/${product._id || alarm.productId}`}
                                        className="flex flex-1 items-center gap-4 max-md:gap-3 min-w-0 group/link"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center text-2xl shrink-0 overflow-hidden group-hover/link:bg-suzgec-primary/5 transition-colors">
                                            {product.imageUrl || product.image ? (
                                                <img src={product.imageUrl || product.image} className="w-full h-full object-contain p-1 group-hover/link:scale-110 transition-transform" alt="" />
                                            ) : (
                                                <span>{product.category === "Telefon" ? "📱" : "📦"}</span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="text-sm font-semibold truncate group-hover/link:text-suzgec-primary transition-colors">{product.name || alarm.productName}</h3>
                                                <Badge variant="secondary" className="text-[10px] h-4 shrink-0 max-md:hidden">{product.category || "Genel"}</Badge>
                                                {isClose && <Badge className="text-[10px] h-4 bg-suzgec-warning/15 text-suzgec-warning border-0 shrink-0 max-md:hidden">Hedefe Yakın!</Badge>}
                                            </div>
                                            <p className="text-xs text-muted-foreground max-md:hidden">{product.seller || "Satıcı"} · {new Date(alarm.createdAt).toLocaleDateString("tr-TR")}</p>
                                        </div>

                                        <div className="text-right shrink-0 max-md:hidden">
                                            <p className="text-xs text-muted-foreground">Şu anki fiyat</p>
                                            <p className="text-sm font-bold">{formatPrice(currentPrice)} ₺</p>
                                        </div>

                                        <div className="text-center shrink-0 px-3 max-md:hidden">
                                            <TrendingDown className="h-4 w-4 text-muted-foreground mx-auto" />
                                            <p className="text-[10px] text-muted-foreground mt-0.5">%{pricePct}</p>
                                        </div>

                                        <div className="text-right shrink-0 max-md:hidden">
                                            <p className="text-xs text-muted-foreground">Hedef fiyat</p>
                                            <p className="text-sm font-bold text-suzgec-primary">{formatPrice(alarm.targetPrice)} ₺</p>
                                        </div>
                                    </Link>

                                    {/* Mobil fiyat bilgisi */}
                                    <div className="hidden max-md:flex items-center justify-between bg-muted/30 rounded-xl overflow-hidden">
                                        <div className="text-center flex-1 py-3 px-4">
                                            <p className="text-[11px] text-muted-foreground mb-0.5">Şu anki fiyat</p>
                                            <p className="text-base font-bold">{formatPrice(currentPrice)} ₺</p>
                                        </div>
                                        <div className="w-px h-8 bg-border/60" />
                                        <div className="text-center flex-1 py-3 px-4">
                                            <p className="text-[11px] text-muted-foreground mb-0.5">Hedef fiyat</p>
                                            <p className="text-base font-bold text-suzgec-primary">{formatPrice(alarm.targetPrice)} ₺</p>
                                        </div>
                                        {isClose && (
                                            <div className="bg-suzgec-warning/15 px-3 py-3 flex items-center">
                                                <Badge className="text-[10px] h-5 bg-suzgec-warning/20 text-suzgec-warning border-0">Yakın!</Badge>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 max-md:ml-0 ml-2 relative z-10 max-md:justify-end max-md:pt-0">
                                        <button
                                            onClick={() => setEditingAlarm(alarm)}
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-suzgec-primary transition-colors"
                                            title="Düzenle"
                                        >
                                            <BellRing className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => toggleAlarm(alarm._id, isEnabled)}
                                            className="transition-colors"
                                            title={isEnabled ? "Devre dışı bırak" : "Etkinleştir"}
                                        >
                                            {isEnabled ? (
                                                <ToggleRight className="h-7 w-7 text-suzgec-primary" />
                                            ) : (
                                                <ToggleLeft className="h-7 w-7 text-muted-foreground" />
                                            )}
                                        </button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-suzgec-danger"
                                            onClick={() => setAlarmToDelete(alarm)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {editingAlarm && (
                <AddPriceAlertDialog
                    alertId={editingAlarm._id}
                    initialPrice={editingAlarm.currentPrice || editingAlarm.product?.currentPrice}
                    initialTargetPrice={editingAlarm.targetPrice}
                    productName={editingAlarm.productName || editingAlarm.product?.name}
                    isOpen={!!editingAlarm}
                    onOpenChange={(open) => !open && setEditingAlarm(null)}
                    onSuccess={fetchAlarms}
                />
            )}

            <Dialog open={!!alarmToDelete} onOpenChange={(open) => !open && setAlarmToDelete(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Alarmı Sil</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{alarmToDelete?.product?.name || alarmToDelete?.productName}</span> ürünü için kurulan alarmı silmek istediğinize emin misiniz?
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                        <Button variant="outline" onClick={() => setAlarmToDelete(null)} disabled={loading}>Vazgeç</Button>
                        <Button
                            variant="destructive"
                            disabled={loading}
                            onClick={() => deleteAlarm(alarmToDelete?._id)}
                        >
                            {loading ? "Siliniyor..." : "Evet, Sil"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {!loading && alarms.length === 0 && (
                <div className="text-center py-16">
                    <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Henüz alarm yok</h3>
                    <p className="text-sm text-muted-foreground">Fiyatını takip etmek istediğiniz ürünler için alarm ekleyin.</p>
                </div>
            )}
        </div>
    )
}
