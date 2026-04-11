"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Bell, 
    Check, 
    Trash2, 
    Clock, 
    Tag, 
    Package, 
    ArrowUpRight, 
    CheckCheck,
    ShoppingBag,
    BellRing
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { useNotifications } from "@/context/NotificationContext"

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
}

export default function NotificationsPage() {
    const { showToast } = useToast()
    const { refreshUnreadCount } = useNotifications()
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState("")

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            const user = JSON.parse(userStr)
            setUserName(`${user.firstName || ''} ${user.lastName || ''}`)
        }
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            const res = await api.getNotifications()
            setNotifications(Array.isArray(res) ? res : [])
        } catch (err) {
            showToast("Bildirimler yüklenemedi", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleMarkRead = async (id: string) => {
        try {
            const res = await api.markNotificationRead(id)
            if (res._id || res.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
                showToast("Okundu işaretlendi", "success")
                refreshUnreadCount()
            } else {
                showToast("İşlem başarısız oldu", "error")
            }
        } catch (err) {
            showToast("Bağlantı hatası oluştu", "error")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await api.deleteNotification(id)
            if (res.success) {
                setNotifications(prev => prev.filter(n => n._id !== id))
                showToast("Bildirim silindi", "success")
                refreshUnreadCount()
            } else {
                showToast(res.error || "Bildirim silinemedi", "error")
            }
        } catch (err) {
            showToast("Bağlantı hatası oluştu", "error")
        }
    }

    const handleMarkAllRead = async () => {
        const unreadIds = notifications.filter(n => !n.read).map(n => n._id)
        if (unreadIds.length === 0) return
        try {
            const results = await Promise.all(unreadIds.map(id => api.markNotificationRead(id)))
            const someSuccess = results.some(r => r._id || r.success)
            
            if (someSuccess) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                showToast("Bildirimler okundu", "success")
                refreshUnreadCount()
            } else {
                showToast("İşlem başarısız oldu", "error")
            }
        } catch (err) {
            showToast("Hata oluştu", "error")
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'price_drop': return <Tag className="h-4 w-4" />
            case 'stock_alert': return <Package className="h-4 w-4" />
            case 'price_target': return <ArrowUpRight className="h-4 w-4" />
            default: return <Bell className="h-4 w-4" />
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="h-10 w-10 border-3 border-[#6b21a8] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Yükleniyor...</p>
        </div>
    )

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] flex items-center justify-center text-white shadow-lg shadow-suzgec-primary/20">
                            <BellRing className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Bildirimler</h1>
                            <p className="text-xs text-muted-foreground">{userName || 'Kullanıcı'} için güncel haberler</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-suzgec-primary/10 text-suzgec-primary border-0 text-[10px] h-6">
                            {unreadCount} Yeni
                        </Badge>
                        {unreadCount > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleMarkAllRead} 
                                className="h-8 text-xs text-muted-foreground hover:text-suzgec-primary gap-1.5"
                            >
                                <CheckCheck className="h-3.5 w-3.5" /> 
                                <span className="hidden sm:inline">Tümünü Okundu İşaretle</span>
                            </Button>
                        )}
                    </div>
                </div>

                {}
                <div className="space-y-2">
                    {notifications.length > 0 ? (
                        <motion.div variants={container} initial="hidden" animate="show" className="space-y-1.5">
                            <AnimatePresence mode="popLayout">
                                {notifications.map((notif) => (
                                    <motion.div
                                        key={notif._id}
                                        variants={item}
                                        layout
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`group relative flex items-center gap-4 p-3 rounded-xl border border-transparent transition-all duration-200 ${
                                            !notif.read ? 'bg-suzgec-primary/[0.03] border-suzgec-primary/10 hover:border-[#6b21a8]/20' : 'hover:bg-muted/50 hover:border-border/50'
                                        }`}
                                    >
                                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${!notif.read ? 'bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white' : 'bg-muted text-muted-foreground'}`}>
                                            {getIcon(notif.type)}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-sm font-bold truncate ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.productName}</h3>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{notif.message}</p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-muted/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: tr })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            {!notif.read && (
                                                <Button variant="ghost" size="icon" onClick={() => handleMarkRead(notif._id)} title="Okundu" className="h-8 w-8 text-suzgec-primary hover:bg-suzgec-primary/10">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(notif._id)} title="Sil" className="h-8 w-8 text-muted-foreground hover:text-suzgec-danger hover:bg-suzgec-danger/10 text-muted-foreground">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="w-[1px] h-4 bg-border/60 mx-1 hidden sm:block" />
                                            <Button asChild variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 border-[#6b21a8]/20 text-suzgec-primary hover:bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:text-white transition-all shadow-sm">
                                                <Link href={`/arama?q=${encodeURIComponent(notif.productName)}`}>
                                                    <ShoppingBag className="h-3.5 w-3.5" /> 
                                                    <span className="hidden sm:inline">Ürüne Git</span>
                                                </Link>
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50"><Bell className="h-8 w-8 text-muted-foreground" /></div>
                            <h3 className="font-bold text-lg">Henüz bildiriminiz yok</h3>
                            <p className="text-sm text-muted-foreground mt-1 px-4">Fiyat alarmları ve stok haberleri buradan takip edebilirsiniz.</p>
                            <Button asChild className="mt-6 bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white"><Link href="/">Alışverişe Başla</Link></Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
