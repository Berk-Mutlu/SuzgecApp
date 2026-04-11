"use client"
import { motion } from "framer-motion"
import { Plus, Heart, ArrowRight, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPrice } from "@/lib/mock-data"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
export default function WatchlistsPage() {
    const { showToast } = useToast()
    const [watchLists, setWatchLists] = useState<any[]>([])
    const [newListName, setNewListName] = useState("")
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [listToDelete, setListToDelete] = useState<any>(null)
    const [selectedColor, setSelectedColor] = useState("#7c3aed")
    const [selectedIcon, setSelectedIcon] = useState("📋")
    const [selectionMode, setSelectionMode] = useState<"icon" | "color">("icon")
    const [listToEdit, setListToEdit] = useState<any>(null)
    const [editName, setEditName] = useState("")
    const [editColor, setEditColor] = useState("")
    const [editIcon, setEditIcon] = useState("")
    const [editMode, setEditMode] = useState<"icon" | "color">("icon")
    const fetchLists = () => {
        api.getLists().then(res => {
            const data = res.data || (Array.isArray(res) ? res : [])
            setWatchLists(data)
        }).catch(err => {
            console.error('Fetch lists error:', err);
        })
    }
    useEffect(() => {
        fetchLists()
    }, [])
    const handleCreateList = async () => {
        if (!newListName.trim()) return
        setLoading(true)
        try {
            const finalIcon = selectionMode === "icon" ? selectedIcon : ""
            const finalColor = selectionMode === "color" ? selectedColor : "#7c3aed"
            const res = await api.createList(newListName, finalColor, finalIcon)
            if (res.success || res._id) {
                showToast("Liste başarıyla oluşturuldu", "success")
                setNewListName("")
                setSelectedColor("#7c3aed")
                setSelectedIcon("📋")
                setSelectionMode("icon")
                setIsDialogOpen(false)
                fetchLists()
            } else {
                showToast(res.message || "Liste oluşturulamadı", "error")
            }
        } catch (err) {
            showToast("Hata oluştu", "error")
        } finally {
            setLoading(false)
        }
    }
    const handleUpdateList = async () => {
        if (!editName.trim()) return
        setLoading(true)
        try {
            const finalIcon = editMode === "icon" ? editIcon : ""
            const finalColor = editMode === "color" ? editColor : "#7c3aed"
            const res = await api.updateList(listToEdit._id || listToEdit.id, editName, finalColor, finalIcon)
            if (res.success) {
                showToast("Liste güncellendi", "success")
                setListToEdit(null)
                fetchLists()
            } else {
                showToast(res.message || "Güncellenemedi", "error")
            }
        } catch (err) {
            showToast("Hata oluştu", "error")
        } finally {
            setLoading(false)
        }
    }
    const openEditDialog = (list: any) => {
        setListToEdit(list)
        setEditName(list.name)
        setEditColor(list.color || "#7c3aed")
        setEditIcon(list.icon || "")
        setEditMode(list.icon ? "icon" : "color")
    }
    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] flex items-center justify-center text-white shadow-lg shadow-suzgec-primary/20">
                        <Heart className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Listelerim</h1>
                        <p className="text-xs text-muted-foreground">{watchLists.length} liste · {watchLists.reduce((acc, l) => acc + (l.itemCount || 0), 0)} ürün</p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white hover:opacity-90"><Plus className="h-4 w-4 mr-2" />Yeni Liste Oluştur</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Yeni Liste Oluştur</DialogTitle></DialogHeader>
                        <div className="space-y-4 mt-2">
                            <div><label className="text-sm font-medium mb-1.5 block">Liste Adı</label><Input value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder="ör. Alınacaklar" /></div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Liste Stilini Seç</label>
                                <div className="flex bg-muted p-1 rounded-lg mb-4">
                                    <button 
                                        onClick={() => setSelectionMode("icon")}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${selectionMode === "icon" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                    >
                                        İkon
                                    </button>
                                    <button 
                                        onClick={() => setSelectionMode("color")}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${selectionMode === "color" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                    >
                                        Sadece Renk
                                    </button>
                                </div>
                                {selectionMode === "icon" ? (
                                    <div className="flex flex-wrap gap-2">
                                        {["📋", "🎁", "📱", "🏠", "🎮", "⚽", "🍳", "✨"].map((icon) => (
                                            <button 
                                                key={icon} 
                                                onClick={() => setSelectedIcon(icon)}
                                                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${selectedIcon === icon ? "border-suzgec-primary bg-suzgec-primary/10 shadow-inner" : "border-transparent hover:bg-muted"}`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {["#7c3aed", "#3b82f6", "#059669", "#ea580c", "#dc2626", "#ec4899"].map((c) => (
                                            <button 
                                                key={c} 
                                                onClick={() => setSelectedColor(c)}
                                                className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === c ? "scale-110 shadow-md border-foreground" : "border-transparent hover:scale-110"}`} 
                                                style={{ backgroundColor: c }} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button 
                                onClick={handleCreateList} 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white"
                            >
                                {loading ? "Oluşturuluyor..." : "Oluştur"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {watchLists.map((list, index) => {
                    const listColor = list.color || "#7c3aed"
                    const listIcon = list.icon || "📋"
                    return (
                        <motion.div 
                            key={list._id || list.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-6 border-border/50 hover:border-suzgec-primary/30 hover:shadow-xl hover:shadow-suzgec-primary/5 transition-all duration-300 group flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div 
                                            className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110 overflow-hidden" 
                                            style={{ backgroundColor: listColor + "18", color: listColor }}
                                        >
                                            {list.icon ? list.icon : <div className="h-full w-full" style={{ backgroundColor: listColor }} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base group-hover:text-suzgec-primary transition-colors">{list.name}</h3>
                                            <p className="text-xs text-muted-foreground">{list.itemCount} Ürün</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 rounded-xl p-1">
                                            <DropdownMenuItem onClick={() => openEditDialog(list)} className="rounded-lg gap-2">
                                                Düzenle
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => setListToDelete(list)}
                                                className="text-destructive font-medium"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" /> Sil
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                {}
                                <div className="flex -space-x-3 mb-6 overflow-hidden py-1">
                                    {(list.previewItems && list.previewItems.length > 0) ? (
                                        list.previewItems.map((item: any, idx: number) => (
                                            <div 
                                                key={idx}
                                                className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden shadow-sm"
                                                title={item.name}
                                            >
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-[10px]">📦</span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-muted-foreground italic px-1">Henüz ürün eklenmemiş</div>
                                    )}
                                    {list.itemCount > 4 && (
                                        <div className="h-10 w-10 rounded-full border-2 border-background bg-suzgec-primary/10 text-suzgec-primary flex items-center justify-center text-[10px] font-bold shadow-sm">
                                            +{list.itemCount - 4}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto">
                                    <Link 
                                        href={`/listelerim/${list._id || list.id}`} 
                                        className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-muted/50 text-sm text-suzgec-primary font-semibold hover:bg-suzgec-primary/10 transition-colors group/link"
                                    >
                                        Listeyi Görüntüle
                                        <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </motion.div>
            {}
            <Dialog open={!!listToDelete} onOpenChange={(open) => !open && setListToDelete(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Listeyi Sil</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{listToDelete?.name}</span> listesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                        <Button variant="outline" onClick={() => setListToDelete(null)} disabled={loading}>Vazgeç</Button>
                        <Button 
                            variant="destructive" 
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true)
                                try {
                                    const res = await api.deleteList(listToDelete._id || listToDelete.id)
                                    if(res.success) {
                                        showToast("Liste silindi", "success")
                                        setListToDelete(null)
                                        fetchLists()
                                    }
                                } catch (err) {
                                    showToast("Hata oluştu", "error")
                                } finally {
                                    setLoading(false)
                                }
                            }}
                        >
                            {loading ? "Siliniyor..." : "Evet, Sil"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {}
            <Dialog open={!!listToEdit} onOpenChange={(open) => !open && setListToEdit(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Listeyi Düzenle</DialogTitle></DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div><label className="text-sm font-medium mb-1.5 block">Liste Adı</label><Input value={editName} onChange={(e) => setEditName(e.target.value)} /></div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Liste Stili</label>
                            <div className="flex bg-muted p-1 rounded-lg mb-4">
                                <button 
                                    onClick={() => setEditMode("icon")}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${editMode === "icon" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    İkon
                                </button>
                                <button 
                                    onClick={() => setEditMode("color")}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${editMode === "color" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Sadece Renk
                                </button>
                            </div>
                            {editMode === "icon" ? (
                                <div className="flex flex-wrap gap-2">
                                    {["📋", "🎁", "📱", "🏠", "🎮", "⚽", "🍳", "✨"].map((icon) => (
                                        <button 
                                            key={icon} 
                                            onClick={() => setEditIcon(icon)}
                                            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${editIcon === icon ? "border-suzgec-primary bg-suzgec-primary/10 shadow-inner" : "border-transparent hover:bg-muted"}`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {["#7c3aed", "#3b82f6", "#059669", "#ea580c", "#dc2626", "#ec4899"].map((c) => (
                                        <button 
                                            key={c} 
                                            onClick={() => setEditColor(c)}
                                            className={`w-9 h-9 rounded-full border-2 transition-all ${editColor === c ? "scale-110 shadow-md border-foreground" : "border-transparent hover:scale-110"}`} 
                                            style={{ backgroundColor: c }} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button 
                            onClick={handleUpdateList} 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white"
                        >
                            {loading ? "Güncelleniyor..." : "Güncelle"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
