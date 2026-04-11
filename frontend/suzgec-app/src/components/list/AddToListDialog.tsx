"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"
import { Plus, Check, Heart, Loader2 } from "lucide-react"

interface AddToListDialogProps {
    productId: string
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    productName?: string
}

export function AddToListDialog({ productId, isOpen, onOpenChange, productName }: AddToListDialogProps) {
    const { showToast } = useToast()
    const router = useRouter()
    const [lists, setLists] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [newListName, setNewListName] = useState("")
    const [selectedColor, setSelectedColor] = useState("#7c3aed")
    const [selectedIcon, setSelectedIcon] = useState("📋")
    const [selectionMode, setSelectionMode] = useState<"icon" | "color">("icon")

    const fetchLists = async () => {
        try {
            const res = await api.getLists()
            setLists(res.data || (Array.isArray(res) ? res : []))
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchLists()
        }
    }, [isOpen])

    const handleAddToList = async (listId: string) => {
        const token = localStorage.getItem('token')
        if (!token) {
            showToast("Giriş yapmanız gerekiyor.", "error")
            onOpenChange(false)
            router.push('/giris')
            return
        }
        setLoading(true)
        try {
            const res = await api.addProductToList(listId, productId)
            if (res.success) {
                showToast("Ürün listeye eklendi", "success")
                onOpenChange(false)
            } else {
                showToast(res.message || "Hata oluştu", "error")
            }
        } catch (err) {
            showToast("Giriş yapmanız gerekiyor", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAndAdd = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            showToast("Giriş yapmanız gerekiyor.", "error")
            onOpenChange(false)
            router.push('/giris')
            return
        }

        if (!newListName.trim()) return
        setLoading(true)
        try {
            
            const finalIcon = selectionMode === "icon" ? selectedIcon : ""
            const finalColor = selectionMode === "color" ? selectedColor : "#7c3aed"

            const res = await api.createList(newListName, finalColor, finalIcon)
            if (res.success || res._id) {
                const listId = res.data?._id || res._id
                await handleAddToList(listId)
            }
        } catch (err) {
            showToast("Liste oluşturulamadı", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Heart className="h-5 w-5 text-suzgec-primary fill-suzgec-primary" />
                        Listeye Ekle
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {}
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Mevcut Listelerin</p>
                        <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                            {lists.map((list) => (
                                <button
                                    key={list._id || list.id}
                                    onClick={() => handleAddToList(list._id || list.id)}
                                    disabled={loading}
                                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-suzgec-primary/50 hover:bg-suzgec-primary/5 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="h-8 w-8 rounded-lg flex items-center justify-center text-sm shadow-sm"
                                            style={{ backgroundColor: (list.color || "#7c3aed") + "18", color: list.color || "#7c3aed" }}
                                        >
                                            {list.icon || <div className="h-3 w-3 rounded-full" style={{ backgroundColor: list.color }} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{list.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{list.itemCount} Ürün</p>
                                        </div>
                                    </div>
                                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-suzgec-primary transition-colors" />
                                </button>
                            ))}
                            {lists.length === 0 && !loading && (
                                <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/20 rounded-xl">Henüz bir listen yok.</p>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="pt-4 border-t border-border/50">
                        <button 
                            onClick={() => setIsCreating(!isCreating)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-border hover:border-suzgec-primary hover:text-suzgec-primary transition-all text-sm font-medium"
                        >
                            {isCreating ? "Vazgeç" : <><Plus className="h-4 w-4" /> Yeni Liste Oluştur</>}
                        </button>

                        <AnimatePresence>
                            {isCreating && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-4 pt-4"
                                >
                                    <div className="space-y-3">
                                        <Input 
                                            placeholder="Liste adı (örn: Favorilerim)" 
                                            value={newListName}
                                            onChange={(e) => setNewListName(e.target.value)}
                                            className="rounded-xl border-border/60 focus:ring-suzgec-primary"
                                        />
                                        
                                        {}
                                        <div className="flex bg-muted p-1 rounded-lg">
                                            <button 
                                                onClick={() => setSelectionMode("icon")}
                                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${selectionMode === "icon" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                İkon Seç
                                            </button>
                                            <button 
                                                onClick={() => setSelectionMode("color")}
                                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${selectionMode === "color" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                Renk Seç
                                            </button>
                                        </div>

                                        {selectionMode === "icon" ? (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {["📋", "🎁", "📱", "🏠", "🎮", "⚽", "🍳", "✨"].map((icon) => (
                                                    <button 
                                                        key={icon} 
                                                        onClick={() => setSelectedIcon(icon)}
                                                        className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-all ${selectedIcon === icon ? "border-suzgec-primary bg-suzgec-primary/10 shadow-inner" : "border-transparent hover:bg-muted"}`}
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {["#7c3aed", "#3b82f6", "#059669", "#ea580c", "#dc2626", "#ec4899"].map((c) => (
                                                    <button 
                                                        key={c} 
                                                        onClick={() => setSelectedColor(c)}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "scale-110 shadow-md border-foreground" : "border-transparent hover:scale-110"}`} 
                                                        style={{ backgroundColor: c }} 
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <Button 
                                            onClick={handleCreateAndAdd}
                                            disabled={loading || !newListName.trim()}
                                            className="w-full bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white rounded-xl shadow-lg shadow-suzgec-primary/20"
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Oluştur ve Ekle"}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
