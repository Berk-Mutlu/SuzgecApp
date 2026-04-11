"use client"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, use } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
import Link from "next/link"
export default function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { showToast } = useToast()
    const [list, setList] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const fetchList = () => {
        api.getListById(id).then(res => {
            if (res.success) {
                setList(res.data)
            } else {
                showToast(res.message || "Liste bulunamadı", "error")
            }
            setLoading(false)
        }).catch(() => setLoading(false))
    }
    useEffect(() => {
        fetchList()
    }, [id])
    const [confirmDelete, setConfirmDelete] = useState(false)
    const handleDeleteList = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true)
            setTimeout(() => setConfirmDelete(false), 3000)
            return
        }
        try {
            const res = await api.deleteList(id)
            if (res.success) {
                showToast("Liste silindi", "success")
                window.location.href = "/listelerim"
            }
        } catch (err) {
            showToast("Hata oluştu", "error")
        }
    }
    const handleRemoveItem = async (productId: string) => {
        try {
            const res = await api.removeProductFromList(id, productId)
            if (res.success) {
                showToast("Ürün listeden kaldırıldı", "success")
                fetchList()
            } else {
                showToast(res.message || "Hata oluştu", "error")
            }
        } catch (err) {
            showToast("Hata oluştu", "error")
        }
    }
    if (loading) return <div className="p-12 text-center">Yükleniyor...</div>
    if (!list) {
        return (
            <div className="px-4 sm:px-6 py-12 text-center">
                <h1 className="text-xl font-bold mb-2">Liste Bulunamadı</h1>
                <p className="text-muted-foreground text-sm mb-4">Bu liste mevcut değil veya silinmiş olabilir.</p>
                <Link href="/listelerim">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Listelere Dön
                    </Button>
                </Link>
            </div>
        )
    }
    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            {}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <Link href="/listelerim" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3">
                    <ArrowLeft className="h-3.5 w-3.5" /> Listelere Dön
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div 
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-lg shadow-sm overflow-hidden" 
                            style={{ backgroundColor: (list.color || "#7c3aed") + "18", color: list.color }}
                        >
                            {list.icon ? list.icon : <div className="h-full w-full" style={{ backgroundColor: list.color }} />}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{list.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                {list.items?.length || 0} ürün
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={handleDeleteList}
                            variant={confirmDelete ? "destructive" : "outline"} 
                            size="sm" 
                            className={`text-xs gap-1.5 ${confirmDelete ? "" : "text-suzgec-danger border-suzgec-danger/30 hover:bg-suzgec-danger/10"}`}
                        >
                            <Trash2 className="h-3.5 w-3.5" /> 
                            {confirmDelete ? "Emin misiniz? (Sil)" : "Listeyi Sil"}
                        </Button>
                    </div>
                </div>
            </motion.div>
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {list.items && list.items.map((item: any, i: number) => (
                    <motion.div
                        key={item._id || item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="border-border/50 hover:border-[#6b21a8]/20 hover:shadow-md transition-all group relative">
                            <Link href={`/urun/${item._id || item.id}`} className="p-4 block">
                                <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                                    {(item.imageUrl || item.image) ? (
                                        <img 
                                            src={item.imageUrl || item.image} 
                                            alt={item.name}
                                            className="w-full h-full object-contain relative z-10 p-2 group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.opacity = '0';
                                            }}
                                        />
                                    ) : (
                                        <span className="text-3xl opacity-20">📦</span>
                                    )}
                                </div>
                                <h3 className="text-sm font-medium truncate group-hover:text-suzgec-primary transition-colors">{item.name}</h3>
                                <p className="text-lg font-bold text-suzgec-primary mt-1">{(item.currentPrice || item.price || 0).toLocaleString("tr-TR")} ₺</p>
                            </Link>
                            <div className="absolute bottom-3 right-3 z-20">
                                <Button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleRemoveItem(item._id || item.id);
                                    }}
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:bg-suzgec-danger/10 hover:text-suzgec-danger rounded-full"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
