"use client"

import { motion } from "framer-motion"
import { Plus, X, ArrowLeftRight, Check, Sparkles, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/mock-data"
import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ReactMarkdown from 'react-markdown'
import { useRouter } from "next/navigation"
import { useToast } from "@/context/ToastContext"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function ComparisonPage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [allProducts, setAllProducts] = useState<any[]>([])
    const [selectedProducts, setSelectedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showPicker, setShowPicker] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [aiResult, setAiResult] = useState<string | null>(null)
    const [showAiDialog, setShowAiDialog] = useState(false)

    // Dialog search & list states
    const [pickerSearch, setPickerSearch] = useState("")
    const [pickerSearchResults, setPickerSearchResults] = useState<any[]>([])
    const [pickerSearching, setPickerSearching] = useState(false)
    const [pickerTab, setPickerTab] = useState<'search' | 'list'>('search')
    const [userLists, setUserLists] = useState<any[]>([])
    const [selectedListId, setSelectedListId] = useState<string | null>(null)
    const [selectedListItems, setSelectedListItems] = useState<any[]>([])
    const [listsLoading, setListsLoading] = useState(false)

    const fetchComparison = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/giris')
                return
            }

            const res = await api.getComparison()
            if (res.success) {
                setSelectedProducts(res.data?.items || [])
            }
        } catch (err) {
            console.error(err)
            showToast("Karşılaştırma listesi yüklenemedi", "error")
        } finally {
            setLoading(false)
        }
    }

    const fetchAllProducts = async () => {
        try {
            const res = await api.searchProducts("")
            const data = res.data || (Array.isArray(res) ? res : [])
            setAllProducts(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleAiCompare = async () => {
        if (selectedProducts.length < 2) {
            showToast("En az 2 ürün seçmelisiniz", "info")
            return
        }
        setShowAiDialog(true)
        setAiLoading(true)
        setAiResult(null)
        try {
            const res = await api.aiCompareProducts(selectedProducts)
            if (res.success && res.advice) {
                setAiResult(res.advice)
            } else {
                setAiResult("Yapay zeka asistanı şu an yanıt veremiyor: " + (res.error || "Bilinmeyen hata"))
            }
        } catch (err) {
            setAiResult("Bağlantı hatası.")
        } finally {
            setAiLoading(false)
        }
    }

    useEffect(() => {
        fetchComparison()
        fetchAllProducts()
    }, [])

    // Dialog search handler - only triggered on submit
    const executePickerSearch = useCallback(async () => {
        const query = pickerSearch.trim()
        if (query.length < 2) {
            setPickerSearchResults(allProducts)
            return
        }
        setPickerSearching(true)
        try {
            const res = await api.searchProducts(query)
            const data = res.data || (Array.isArray(res) ? res : [])
            setPickerSearchResults(data)
        } catch (err) {
            console.error(err)
        } finally {
            setPickerSearching(false)
        }
    }, [pickerSearch, allProducts])

    const handlePickerSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        executePickerSearch()
    }

    // Fetch user lists when dialog opens
    const handleOpenPicker = async () => {
        setShowPicker(true)
        setPickerTab('search')
        setPickerSearch("")
        setPickerSearchResults(allProducts)
        setSelectedListId(null)
        setSelectedListItems([])
        
        setListsLoading(true)
        try {
            const res = await api.getLists()
            const data = res.data || (Array.isArray(res) ? res : [])
            setUserLists(data)
        } catch (err) {
            console.error(err)
        } finally {
            setListsLoading(false)
        }
    }

    // Fetch list items when a list is selected
    const handleSelectList = async (listId: string) => {
        setSelectedListId(listId)
        try {
            const res = await api.getListById(listId)
            if (res.success && res.data) {
                setSelectedListItems(res.data.items || [])
            }
        } catch (err) {
            console.error(err)
        }
    }

    const specs = selectedProducts.length > 0 && selectedProducts[0].specs
        ? Object.keys(selectedProducts[0].specs)
        : []

    const removeProduct = async (id: string) => {
        try {
            const res = await api.removeFromComparison(id)
            if (res.success) {
                setSelectedProducts((prev) => prev.filter((p) => (p._id || p.id) !== id))
                showToast("Ürün karşılaştırmadan çıkarıldı", "success")
            } else {
                showToast(res.message || "Hata oluştu", "error")
            }
        } catch (err) {
            showToast("İşlem başarısız oldu", "error")
        }
    }

    const addProduct = async (product: any) => {
        if (selectedProducts.length >= 4) {
            showToast("En fazla 4 ürün karşılaştırabilirsiniz", "info")
            return
        }

        try {
            const res = await api.addToComparison(product._id || product.id)
            if (res.success) {

                if (!selectedProducts.find(sp => (sp._id || sp.id) === (product._id || product.id))) {
                    setSelectedProducts(prev => [...prev, product])
                }
                showToast("Ürün karşılaştırmaya eklendi", "success")
                setShowPicker(false)
            } else {
                showToast(res.message || "Hata oluştu", "error")
            }
        } catch (err) {
            showToast("İşlem başarısız oldu", "error")
        }
    }

    const getBestPrice = () => {
        if (selectedProducts.length === 0) return null
        return Math.min(...selectedProducts.map((p) => p.price || p.currentPrice))
    }

    const getBestValue = (spec: string) => {
        const values = selectedProducts
            .map((p) => p.specs?.[spec])
            .filter(Boolean)

        if (spec === "Batarya") {
            const nums = values.map((v) => parseInt(v || "0"))
            const max = Math.max(...nums)
            return values.findIndex((v) => parseInt(v || "0") === max)
        }
        if (spec === "RAM" || spec === "Depolama") {
            const nums = values.map((v) => parseInt(v || "0"))
            const max = Math.max(...nums)
            return values.findIndex((v) => parseInt(v || "0") === max)
        }
        return -1
    }

    const bestPrice = getBestPrice()

    // Products to display in picker (filtered by what's already selected)
    const getPickerProducts = () => {
        const source = pickerTab === 'list' ? selectedListItems : (pickerSearchResults.length > 0 || pickerSearch.trim() ? pickerSearchResults : allProducts)
        return source.filter((p: any) => !selectedProducts.find((sp) => (sp._id || sp.id) === (p._id || p.id)))
    }

    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] flex items-center justify-center">
                        <ArrowLeftRight className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Karşılaştırma</h1>
                        <p className="text-sm text-muted-foreground">
                            {selectedProducts.length} ürün karşılaştırılıyor
                        </p>
                    </div>
                </div>

                {selectedProducts.length >= 2 && (
                    <Button
                        onClick={handleAiCompare}
                        className="bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:opacity-90 text-white shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] hover:shadow-lg border-0 transition-all font-semibold rounded-xl px-5 h-10"
                    >
                        <span className="mr-2">✨</span> Suzi Senin İçin Karşılaştırsın
                    </Button>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            { }
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="p-4 text-left text-sm font-semibold w-36 min-w-36 bg-muted/30">
                                        Özellikler
                                    </th>
                                    {selectedProducts.map((product) => (
                                        <th key={product._id || product.id} className="p-4 text-center relative min-w-48">
                                            <button
                                                onClick={() => removeProduct(product._id || product.id)}
                                                className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors z-10"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>

                                            <Link href={`/urun/${product._id || product.id}`} className="block cursor-pointer hover:opacity-80 transition-opacity">
                                                <div className="w-20 h-20 mx-auto mb-3 rounded-lg bg-gradient-to-br from-secondary/80 to-muted flex items-center justify-center relative overflow-hidden">
                                                    {(product.imageUrl || product.image) ? (
                                                        <img
                                                            src={product.imageUrl || product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain relative z-10 p-2"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.opacity = '0';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span className="text-3xl opacity-40 absolute inset-0 flex items-center justify-center">
                                                        {product.category === "Telefon" ? "📱" :
                                                            product.category === "Bilgisayar" ? "💻" : "📦"}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-semibold hover:text-suzgec-primary transition-colors">{product.name}</h3>
                                            </Link>
                                            <p className="text-lg font-bold text-suzgec-primary mt-1">
                                                {(product.price || product.currentPrice || 0).toLocaleString("tr-TR")} ₺
                                                {(product.price || product.currentPrice) === bestPrice && (
                                                    <Badge className="ml-2 text-[10px] bg-suzgec-success border-0 text-white align-middle">
                                                        En ucuz
                                                    </Badge>
                                                )}
                                            </p>
                                        </th>
                                    ))}
                                    {selectedProducts.length < 4 && (
                                        <th className="p-4 text-center min-w-48">
                                            <button
                                                onClick={handleOpenPicker}
                                                className="mx-auto w-20 h-20 mb-3 rounded-lg border-2 border-dashed border-border hover:border-suzgec-primary/50 flex items-center justify-center transition-colors group"
                                            >
                                                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-suzgec-primary transition-colors" />
                                            </button>
                                            <p className="text-xs text-muted-foreground">Ürün Ekle</p>
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            { }
                            <tbody>
                                { }
                                <tr className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                                    <td className="p-3 px-4 text-sm text-muted-foreground bg-muted/30">Satıcı</td>
                                    {selectedProducts.map((p) => (
                                        <td key={p._id || p.id} className="p-3 px-4 text-sm text-center">{p.seller}</td>
                                    ))}
                                    {selectedProducts.length < 4 && <td />}
                                </tr>

                                { }
                                <tr className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                                    <td className="p-3 px-4 text-sm text-muted-foreground bg-muted/30">Durum</td>
                                    {selectedProducts.map((p) => (
                                        <td key={p._id || p.id} className="p-3 px-4 text-sm text-center">
                                            <Badge variant={p.condition === "new" ? "default" : "secondary"} className="text-xs">
                                                {p.condition === "new" ? "Sıfır" : "2. El"}
                                            </Badge>
                                        </td>
                                    ))}
                                    {selectedProducts.length < 4 && <td />}
                                </tr>

                                { }
                                {specs.map((spec) => {
                                    const bestIdx = getBestValue(spec)
                                    return (
                                        <tr key={spec} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                                            <td className="p-3 px-4 text-sm text-muted-foreground bg-muted/30">
                                                {spec}
                                            </td>
                                            {selectedProducts.map((p, i) => (
                                                <td
                                                    key={p._id || p.id}
                                                    className={`p-3 px-4 text-sm text-center font-medium ${bestIdx === i ? "text-suzgec-success" : ""
                                                        }`}
                                                >
                                                    {p.specs?.[spec] || "—"}
                                                    {bestIdx === i && (
                                                        <Check className="h-3 w-3 inline ml-1" />
                                                    )}
                                                </td>
                                            ))}
                                            {selectedProducts.length < 4 && <td />}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>

            {/* Product Picker Dialog */}
            <Dialog open={showPicker} onOpenChange={setShowPicker}>
                <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl border-0 shadow-2xl bg-background overflow-hidden max-h-[80vh]">
                    <DialogHeader className="p-5 pb-0">
                        <DialogTitle className="text-lg font-bold">Ürün Ekle</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Karşılaştırmaya eklemek istediğiniz ürünü seçin
                        </DialogDescription>
                    </DialogHeader>

                    {/* Tabs */}
                    <div className="flex gap-1 px-5 pt-3">
                        <button
                            onClick={() => setPickerTab('search')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pickerTab === 'search' ? 'bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                        >
                            <Search className="h-3.5 w-3.5" /> Ürün Ara
                        </button>
                        <button
                            onClick={() => { setPickerTab('list'); setSelectedListId(null); setSelectedListItems([]) }}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pickerTab === 'list' ? 'bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                        >
                            <Heart className="h-3.5 w-3.5" /> Listelerimden
                        </button>
                    </div>

                    {/* Search Tab */}
                    {pickerTab === 'search' && (
                        <div className="px-5 pt-3">
                            <form onSubmit={handlePickerSearchSubmit} className="relative flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Ürün adı yazın ve Enter'a basın..."
                                        className="pl-10 h-10"
                                        value={pickerSearch}
                                        onChange={(e) => setPickerSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white hover:opacity-90 shrink-0"
                                >
                                    <Search className="h-3.5 w-3.5 mr-1" /> Ara
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* List Tab */}
                    {pickerTab === 'list' && !selectedListId && (
                        <div className="px-5 pt-3 pb-6">
                            {listsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : userLists.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">Henüz listeniz yok</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {userLists.map((list: any) => (
                                        <button
                                            key={list._id}
                                            onClick={() => handleSelectList(list._id)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-suzgec-primary/30 hover:bg-accent/50 transition-all text-left"
                                        >
                                            <span className="text-lg">{list.icon || '📋'}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{list.name}</p>
                                                <p className="text-xs text-muted-foreground">{list.itemCount || 0} ürün</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* List items or back button */}
                    {pickerTab === 'list' && selectedListId && (
                        <div className="px-5 pt-3">
                            <button
                                onClick={() => { setSelectedListId(null); setSelectedListItems([]) }}
                                className="text-xs text-suzgec-primary hover:underline mb-2 flex items-center gap-1"
                            >
                                ← Listelere Dön
                            </button>
                        </div>
                    )}

                    {/* Product Results — only show for search tab or when a list is selected */}
                    {(pickerTab === 'search' || (pickerTab === 'list' && selectedListId)) && (
                    <div className="px-5 pb-5 pt-2 overflow-y-auto max-h-[45vh]">
                        {pickerSearching ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {getPickerProducts().map((product: any) => (
                                    <button
                                        key={product._id || product.id}
                                        onClick={() => addProduct(product)}
                                        className="p-3 rounded-lg border border-border/50 hover:border-suzgec-primary/50 hover:bg-accent/50 transition-all text-left group"
                                    >
                                        {(product.imageUrl || product.image) && (
                                            <div className="w-full h-16 rounded-md bg-muted/50 flex items-center justify-center mb-2 overflow-hidden">
                                                <img
                                                    src={product.imageUrl || product.image}
                                                    alt={product.name}
                                                    className="h-full object-contain p-1"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                                                />
                                            </div>
                                        )}
                                        <p className="text-xs font-medium line-clamp-2 group-hover:text-suzgec-primary transition-colors">{product.name}</p>
                                        <p className="text-xs text-suzgec-primary font-semibold mt-1">
                                            {formatPrice(product.price || product.currentPrice)} ₺
                                        </p>
                                    </button>
                                ))}
                                {getPickerProducts().length === 0 && (
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-sm text-muted-foreground">
                                            {pickerTab === 'list' ? 'Bu listede ürün yok' : 'Ürün bulunamadı'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
                <DialogContent className="sm:max-w-[550px] p-6 rounded-3xl border-0 shadow-[0_20px_50px_-12px_rgba(107,33,168,0.3)] bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-xl font-black bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] bg-clip-text text-transparent flex items-center gap-2">
                            ✨ Suzi
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            Suzi senin için İnstayı saldı
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                        {aiLoading ? (
                            <div className="flex flex-col items-center justify-center py-16 space-y-5">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full border-4 border-[#6b21a8]/20 border-t-[#6b21a8] animate-spin"></div>
                                    <Sparkles className="h-6 w-6 text-[#6b21a8] absolute inset-0 m-auto animate-pulse" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h2 className="text-lg font-bold tracking-tight">Suzi Bekleniyor...</h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Suzi sosyal medyada takılıyor. Relaxla...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-none pb-4">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-lg font-black text-foreground mt-2 mb-2 tracking-tight" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-base font-bold text-foreground mt-2 mb-2 tracking-tight" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-[15px] font-bold text-foreground mt-2 mb-1 tracking-tight" {...props} />,
                                        p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-[15px] text-foreground/90 font-medium" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-3 space-y-1.5 marker:text-suzgec-primary/70" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-3 space-y-1.5 marker:text-suzgec-primary/70" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-[15px] text-foreground/90 font-medium leading-relaxed" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-suzgec-primary" {...props} />,
                                    }}
                                >
                                    {aiResult || ""}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
