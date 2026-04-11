"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, X, TrendingDown, Target, Loader2, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"

interface AddPriceAlertDialogProps {
    productId?: string
    alertId?: string
    initialPrice?: number
    initialTargetPrice?: number
    productName?: string
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function AddPriceAlertDialog({
    productId,
    alertId,
    initialPrice = 0,
    initialTargetPrice,
    productName,
    isOpen,
    onOpenChange,
    onSuccess
}: AddPriceAlertDialogProps) {
    const { showToast } = useToast()
    const router = useRouter()
    const [targetPrice, setTargetPrice] = useState<string>(initialTargetPrice?.toString() || "")
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setTargetPrice(initialTargetPrice?.toString() || "")
            setIsSuccess(false)
        }
    }, [isOpen, initialTargetPrice])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("tr-TR").format(val)
    }

    const handleQuickSet = (percentage: number) => {
        const newPrice = Math.floor(initialPrice * (1 - percentage / 100))
        setTargetPrice(newPrice.toString())
    }

    const handleSubmit = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            showToast("Giriş yapmanız gerekiyor.", "error")
            onOpenChange(false)
            router.push('/giris')
            return
        }

        const price = parseFloat(targetPrice)
        if (isNaN(price) || price <= 0) {
            showToast("Geçerli bir hedef fiyat giriniz.", "error")
            return
        }

        setLoading(true)
        try {
            let res
            if (alertId) {
                res = await api.updatePriceAlert(alertId, { targetPrice: price })
            } else if (productId) {
                res = await api.addPriceAlert({ productId, targetPrice: price })
            }

            if (res && (res.success || res._id)) {
                setIsSuccess(true)
                showToast(alertId ? "Alarm güncellendi" : "Fiyat alarmı kuruldu", "success")
                setTimeout(() => {
                    onOpenChange(false)
                    if (onSuccess) onSuccess()
                }, 1500)
            } else {
                showToast(res?.message || "Bir hata oluştu", "error")
            }
        } catch (error) {
            showToast("İşlem başarısız oldu. Lütfen tekrar deneyin.", "error")
        } finally {
            setLoading(false)
        }
    }

    const numericTarget = parseFloat(targetPrice) || 0
    const priceDiff = initialPrice - numericTarget
    const pricePct = initialPrice > 0 ? ((priceDiff / initialPrice) * 100).toFixed(0) : "0"

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl bg-background">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Bell className="h-5 w-5 text-suzgec-primary fill-suzgec-primary" />
                        {alertId ? "Alarmı Düzenle" : "Fiyat Alarmı Kur"}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Seçili Ürün</p>
                            <p className="text-sm font-medium px-1 line-clamp-1">{productName}</p>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-xl flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Mevcut Fiyat</span>
                            <span className="text-base font-bold text-foreground pr-1">{formatCurrency(initialPrice)} ₺</span>
                        </div>
                    </div>

                    {}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Hedef Fiyatınız</label>
                        <div className="relative">
                            <Input 
                                type="number" 
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(e.target.value)}
                                className="h-12 rounded-xl border-border/60 focus:ring-suzgec-primary pr-10 font-bold"
                                placeholder="0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₺</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground px-1 italic">
                            Fiyat bu seviyeye düştüğünde size bildirim göndereceğiz.
                        </p>
                    </div>

                    {}
                    <div className="pt-2 space-y-2">
                        <Button 
                            onClick={handleSubmit}
                            disabled={loading || isSuccess}
                            className="w-full h-12 bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:opacity-90 text-white rounded-xl shadow-lg shadow-suzgec-primary/20 font-bold transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isSuccess ? (
                                <div className="flex items-center gap-2">
                                    <Check className="h-5 w-5" />
                                    {alertId ? "Güncellendi" : "Alarm Kuruldu"}
                                </div>
                            ) : (
                                alertId ? "Güncellemeyi Onayla" : "Alarmı Şimdi Kur"
                            )}
                        </Button>
                        
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full h-10 text-muted-foreground hover:text-foreground text-sm font-medium"
                        >
                            Vazgeç
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
