"use client"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Heart,
    Bell,
    ExternalLink,
    TrendingDown,
    Check,
    X,
    ArrowLeftRight,
    Star,
    Share2,
    Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/context/ToastContext"
import { useState, use, useEffect, useRef } from "react"
import { api } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts"
import { AddToListDialog } from "@/components/list/AddToListDialog"
import { AddPriceAlertDialog } from "@/components/alerts/AddPriceAlertDialog"
import { getSellerDisplayInfo } from "@/lib/sellerLogos"
import { ShareProductDialog } from "@/components/product/ShareProductDialog"
import { ProductReviews } from "@/components/product/ProductReviews"
export function ProductDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { showToast } = useToast()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [watchLists, setWatchLists] = useState<any[]>([])
    const [showListMenu, setShowListMenu] = useState(false)
    const [isAddListOpen, setIsAddListOpen] = useState(false)
    const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false)
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [redirectingSeller, setRedirectingSeller] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const thumbnailRef = useRef<HTMLDivElement>(null)
    const imageAreaRef = useRef<HTMLDivElement>(null)
    const touchStartX = useRef<number>(0)
    const touchStartY = useRef<number>(0)
    const isSwiping = useRef(false)

    const swipeToImage = (direction: 'next' | 'prev') => {
        if (!product?.imageUrls || product.imageUrls.length <= 1) return;
        const imgs = product.imageUrls;
        const currentIdx = imgs.indexOf(selectedImage);
        const newIdx = direction === 'next'
            ? (currentIdx >= imgs.length - 1 ? 0 : currentIdx + 1)
            : (currentIdx <= 0 ? imgs.length - 1 : currentIdx - 1);
        setSelectedImage(imgs[newIdx]);
    }

    useEffect(() => {
        const el = imageAreaRef.current;
        if (!el) return;

        const onTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
            isSwiping.current = false;
        };
        const onTouchMove = (e: TouchEvent) => {
            const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
            const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
            if (dx > dy && dx > 10) {
                isSwiping.current = true;
                e.preventDefault();
            }
        };
        const onTouchEnd = (e: TouchEvent) => {
            if (!isSwiping.current) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                swipeToImage(diff > 0 ? 'next' : 'prev');
            }
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd, { passive: true });
        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [product, selectedImage])
    const scrollThumbnails = (direction: 'left' | 'right') => {
        if (thumbnailRef.current) {
            const scrollAmount = 100;
            thumbnailRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    }
    const handleAdUrlClick = async (seller: any) => {
        setRedirectingSeller(seller.siteName);
        try {
            const res = await api.resolveAdUrl(id, seller.buyUrl, seller.siteName);
            if (res.success && res.url) {
                window.open(res.url, "_blank");
            } else {
                window.open(seller.buyUrl, "_blank");
            }
        } catch {
            window.open(seller.buyUrl, "_blank");
        } finally {
            setRedirectingSeller(null);
        }
    }
    const handlePriceAlert = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            showToast("Giriş yapmanız gerekiyor.", "error")
            router.push('/giris?returnUrl=' + encodeURIComponent(window.location.pathname))
            return
        }
        setIsPriceAlertOpen(true)
    }
    const handleAddToList = async (listId: string) => {
        try {
            const res = await api.addProductToList(listId, id)
            if (res.success) {
                showToast("Ürün başarıyla listeye eklendi!", "success")
                setShowListMenu(false)
            } else {
                showToast(res.message || "Bir hata oluştu.", "error")
            }
        } catch (error) {
            showToast("Giriş yapmanız gerekiyor.", "error")
        }
    }
    const handleAddToComparison = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            showToast("Giriş yapmanız gerekiyor.", "error")
            router.push('/giris?returnUrl=' + encodeURIComponent(window.location.pathname))
            return
        }
        try {
            const res = await api.addToComparison(id)
            if (res.success) {
                showToast("Ürün karşılaştırma listesine eklendi!", "success")
                router.push('/karsilastirma')
            } else {
                showToast(res.message || "Bir hata oluştu.", "error")
            }
        } catch (error) {
            showToast("İşlem başarısız oldu.", "error")
        }
    }
    const handleAddToListTrigger = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            showToast("Giriş yapmanız gerekiyor.", "error")
            router.push('/giris?returnUrl=' + encodeURIComponent(window.location.pathname))
            return
        }
        setIsAddListOpen(true)
    }
    const handleStockAlert = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            showToast("Giriş yapmanız gerekiyor.", "error")
            router.push('/giris?returnUrl=' + encodeURIComponent(window.location.pathname))
            return
        }
        try {
            const res = await api.addStockAlert({ productId: id })
            if (res.success) {
                showToast("Stok alarmı kuruldu! Ürün stoğa girdiğinde bildirim alacaksınız.", "success")
            } else {
                showToast(res.error || "Alarm kurulamadı.", "error")
            }
        } catch (error) {
            showToast("İşlem başarısız oldu.", "error")
        }
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);
    useEffect(() => {
        Promise.all([
            api.getProduct(id).catch(() => null),
            api.getProductSellers(id).catch(() => ({ sellers: [] }))
        ]).then(([data, sellersData]) => {
            if (data) {
                data.price = data.currentPrice || data.price || 0;
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('testOOS') === '1') {
                    data.sellers = [];
                    data.inStock = false;
                } else {
                    data.sellers = sellersData?.sellers || data.sellers || [];
                }
                data.imageUrls = sellersData?.imageUrls || data.imageUrls || [];
                data.specs = sellersData?.specs || data.specs || {};

                // Satıcı verisinden gelen güncel fiyatı senkronize et
                if (sellersData?.currentPrice) {
                    data.currentPrice = sellersData.currentPrice;
                    data.price = sellersData.currentPrice;
                }

                setProduct(data);
                if (data.imageUrls && data.imageUrls.length > 0) {
                    setSelectedImage(data.imageUrls[0]);
                } else {
                    setSelectedImage(data.imageUrl || data.image);
                }
            }
            setLoading(false);
        });
    }, [id])
    if (loading) {
        return (
            <div className="px-4 py-32 text-center max-md:py-8 max-md:min-h-[60vh] max-md:flex max-md:items-center max-md:justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-6"
                >
                    <div className="relative h-20 w-20">
                        <div className="absolute inset-0 rounded-full border-4 border-[#6b21a8]/20 border-t-[#6b21a8] animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Zap className="h-8 w-8 text-[#6b21a8] animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold tracking-tight">Ürün Detayları Hazırlanıyor...</h2>
                        <p className="text-sm text-muted-foreground animate-pulse leading-relaxed">
                            Güncel teknik özellikler ve en uygun mağaza seçenekleri taranıyor.{"\n"}Lütfen bekleyin...
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }
    if (!product) {
        return (
            <div className="px-4 sm:px-6 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto"
                >
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Ürün Bulunamadı</h1>
                    <p className="text-muted-foreground mb-8">
                        Aradığınız ürün mevcut değil veya sistemimizden kaldırılmış olabilir.
                    </p>
                    <Link href="/">
                        <Button className="bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white hover:opacity-90">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Ana Sayfaya Dön
                        </Button>
                    </Link>
                </motion.div>
            </div>
        )
    }
    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            {}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mb-6"
            >
                <button 
                    onClick={() => router.back()} 
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1 rounded-full hover:bg-muted"
                    title="Geri Dön"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-muted-foreground flex items-center gap-1 overflow-hidden whitespace-nowrap">
                    <span className="shrink-0">Arama &gt; {product.category} &gt;</span>
                    <span className="text-foreground truncate font-medium">{product.name}</span>
                </span>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {}
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                        <Card className="overflow-hidden border-border/50">
                            {}
                            <div className="flex bg-white dark:bg-zinc-950 relative overflow-hidden h-[280px] max-md:flex-col max-md:h-auto">
                                {}
                                <div
                                    ref={imageAreaRef}
                                    className="flex-1 flex items-center justify-center relative p-4 group/image max-md:h-[250px] max-md:flex-none"
                                >
                                    {selectedImage && (
                                        <motion.img
                                            key={selectedImage}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            src={selectedImage}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain relative z-10"
                                        />
                                    )}
                                    <span className="text-8xl opacity-[0.03] absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                                        {product.category === "Telefon" ? "📱" :
                                            product.category === "Bilgisayar" ? "💻" :
                                                product.category === "Televizyon" ? "📺" :
                                                    product.category === "Kulaklık" ? "🎧" :
                                                        product.category === "Oyun Konsolu" ? "🎮" : "📦"}
                                    </span>
                                    {}
                                    {product.imageUrls && product.imageUrls.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    const imgs = product.imageUrls;
                                                    const currentIdx = imgs.indexOf(selectedImage);
                                                    const prevIdx = currentIdx <= 0 ? imgs.length - 1 : currentIdx - 1;
                                                    setSelectedImage(imgs[prevIdx]);
                                                    if (thumbnailRef.current) {
                                                        const thumbEl = thumbnailRef.current.children[prevIdx] as HTMLElement;
                                                        if (thumbEl) thumbEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                                    }
                                                }}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 max-md:opacity-100 transition-opacity"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const imgs = product.imageUrls;
                                                    const currentIdx = imgs.indexOf(selectedImage);
                                                    const nextIdx = currentIdx >= imgs.length - 1 ? 0 : currentIdx + 1;
                                                    setSelectedImage(imgs[nextIdx]);
                                                    if (thumbnailRef.current) {
                                                        const thumbEl = thumbnailRef.current.children[nextIdx] as HTMLElement;
                                                        if (thumbEl) thumbEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                                    }
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 max-md:opacity-100 transition-opacity"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {}
                                {product.imageUrls && product.imageUrls.length > 1 && (
                                    <div className="w-[62px] border-l border-border/40 bg-muted/20 flex flex-col relative group/thumbs max-md:w-full max-md:border-l-0 max-md:border-t max-md:flex-row max-md:h-[54px]">
                                        {}
                                        <button
                                            onClick={() => {
                                                if (thumbnailRef.current) {
                                                    thumbnailRef.current.scrollBy({ top: -120, left: -120, behavior: 'smooth' });
                                                }
                                            }}
                                            className="absolute top-0 left-0 right-0 z-10 h-6 bg-gradient-to-b from-background/90 to-transparent flex items-center justify-center opacity-0 group-hover/thumbs:opacity-100 transition-opacity max-md:hidden"
                                        >
                                            <ChevronLeft className="h-3 w-3 rotate-90" />
                                        </button>
                                        <div
                                            ref={thumbnailRef}
                                            className="flex-1 flex flex-col gap-1.5 p-1.5 overflow-y-auto max-md:flex-row max-md:overflow-x-auto max-md:overflow-y-hidden"
                                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                        >
                                            {product.imageUrls.map((img: string, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedImage(img);
                                                        if (thumbnailRef.current) {
                                                            const thumbEl = thumbnailRef.current.children[i] as HTMLElement;
                                                            if (thumbEl) {
                                                                thumbEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                                            }
                                                        }
                                                    }}
                                                    className={`relative w-full aspect-square rounded-md overflow-hidden border-2 transition-all shrink-0 bg-white max-md:w-[44px] max-md:h-[44px]
                                                        ${selectedImage === img ? "border-suzgec-primary shadow-sm" : "border-transparent hover:border-border"}`}
                                                >
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                        {}
                                        <button
                                            onClick={() => {
                                                if (thumbnailRef.current) {
                                                    thumbnailRef.current.scrollBy({ top: 120, behavior: 'smooth' });
                                                }
                                            }}
                                            className="absolute bottom-0 left-0 right-0 z-10 h-6 bg-gradient-to-t from-background/90 to-transparent flex items-center justify-center opacity-0 group-hover/thumbs:opacity-100 transition-opacity max-md:hidden"
                                        >
                                            <ChevronRight className="h-3 w-3 rotate-90" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {}
                            <div className="p-4 border-t border-border/50">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-lg font-bold leading-tight">{product.name}</h1>
                                    </div>
                                    <div className="flex gap-1.5 shrink-0">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={handleAddToListTrigger}
                                            className="h-8 w-8 rounded-lg"
                                        >
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="h-8 w-8 rounded-lg"
                                            onClick={() => setIsShareOpen(true)}
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                {product.priceChange && product.priceChange < 0 && (
                                    <Badge className="mt-2 bg-suzgec-success border-0 text-white">
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                        %{Math.abs(product.priceChange).toFixed(1)} indirimli
                                    </Badge>
                                )}
                                <div className="flex items-end justify-between mt-3">
                                    <div>
                                        {product.sellers?.length > 0 ? (
                                            <>
                                                <span className="text-2xl font-bold text-suzgec-primary">
                                                    {(product.price || product.currentPrice || 0).toLocaleString("tr-TR")} ₺
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-muted-foreground line-through ml-2">
                                                        {(product.originalPrice).toLocaleString("tr-TR")} ₺
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold text-muted-foreground">Tükendi</span>
                                        )}
                                    </div>
                                    {product.sellers?.length > 0 ? (() => {
                                        const cheapest = [...product.sellers].sort((a: any, b: any) => (a.price || 0) - (b.price || 0))[0];
                                        const cheapestInfo = getSellerDisplayInfo(cheapest.siteName);
                                        return (
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 bg-suzgec-success/10 border border-suzgec-success/20 rounded-full pl-1.5 pr-3 py-1">
                                                    <img
                                                        src={cheapestInfo.logoUrl}
                                                        alt={cheapestInfo.displayName}
                                                        className="h-4 w-4 object-contain rounded-sm"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                                    />
                                                    <span className="text-xs font-medium text-suzgec-success">
                                                        En ucuz {cheapestInfo.displayName}&apos;te
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-muted-foreground">
                                                    +{product.sellers.length - 1} site daha
                                                </span>
                                            </div>
                                        );
                                    })() : (
                                        <div className="flex items-center gap-2">
                                            <Badge variant="destructive" className="bg-destructive/10 text-destructive border-0">
                                                Hiçbir satıcıda yok
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                </motion.div>
                {}
                <div className="flex flex-col gap-4">
                    {}
                    <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Zap className="h-4 w-4 text-[#6b21a8]" />
                                İşlemler
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {(!product.sellers || product.sellers.length === 0) && (
                                <Button 
                                    onClick={handleStockAlert}
                                    className="w-full h-10 rounded-xl bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:scale-105 active:scale-95 text-white font-bold transition-all shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] hover:shadow-[0_6px_20px_rgba(107,33,168,0.4)]"
                                >
                                    <Bell className="h-4 w-4 mr-2" />
                                    Stoka Gelince Haber Ver
                                </Button>
                            )}
                            <Button 
                                onClick={handlePriceAlert}
                                variant="outline"
                                className="w-full h-10 rounded-xl border-border/60 hover:border-suzgec-primary/50 hover:text-suzgec-primary font-bold transition-all active:scale-[0.98]"
                            >
                                <TrendingDown className="h-4 w-4 mr-2" />
                                Fiyat Alarmı Kur
                            </Button>
                            <Button 
                                onClick={() => setIsAddListOpen(true)}
                                variant="outline" 
                                className="w-full h-10 rounded-xl border-border/60 hover:border-suzgec-primary/50 hover:text-suzgec-primary font-bold transition-all active:scale-[0.98]"
                            >
                                <Heart className="h-4 w-4 mr-2" />
                                Listeye Ekle
                            </Button>
                            <Button 
                                onClick={handleAddToComparison}
                                variant="outline" 
                                className="w-full h-10 rounded-xl border-border/60 hover:border-suzgec-primary/50 hover:text-suzgec-primary font-bold transition-all active:scale-[0.98]"
                            >
                                <ArrowLeftRight className="h-4 w-4 mr-2" />
                                Karşılaştır
                            </Button>
                        </div>
                        <AddToListDialog 
                            productId={id} 
                            isOpen={isAddListOpen} 
                            onOpenChange={setIsAddListOpen} 
                            productName={product.name}
                        />
                    </Card>
                    {}
                    <Card className="p-3 border-border/50 flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-suzgec-success" />
                            Fiyat Geçmişi
                        </h3>
                        <div className="flex-1 min-h-[60px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={product.priceHistory || []}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: "#888888" }}
                                        minTickGap={20}
                                    />
                                    <YAxis
                                        hide
                                        domain={["dataMin - 5000", "dataMax + 5000"]}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: "var(--card)",
                                            borderColor: "var(--border)",
                                            borderRadius: "12px",
                                            fontSize: "12px"
                                        }}
                                        itemStyle={{ color: "#7c3aed" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#7c3aed"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                {}
                <motion.div
                    className="lg:col-span-2 flex flex-col gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                        <Card className="border-border/50 overflow-hidden">
                            <div className="px-4 py-1.5 border-b border-border/50">
                                <h2 className="text-sm font-semibold">Satıcılar ({(product.sellers || []).length})</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-muted-foreground text-xs">
                                            <th className="text-left py-2.5 px-5 max-md:px-3 font-medium">Site</th>
                                            <th className="text-left py-2.5 px-5 max-md:px-3 font-medium">Fiyat</th>
                                            <th className="text-left py-2.5 px-5 font-medium max-md:hidden">Kargo</th>
                                            <th className="text-center py-2.5 px-5 font-medium max-md:hidden">Durum</th>
                                            <th className="text-right py-2.5 px-5 max-md:px-3 font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...(product.sellers || [])].sort((a: any, b: any) => (a.price || 0) - (b.price || 0)).map((seller: any, idx: number) => (
                                            <tr
                                                key={idx}
                                                className={`border-t border-border/50 hover:bg-accent/50 transition-colors ${
                                                    idx === 0 ? "bg-suzgec-success/5" : ""
                                                }`}
                                            >
                                                <td className="py-2.5 px-5 max-md:px-3">
                                                    {(() => {
                                                        const sellerInfo = getSellerDisplayInfo(seller.siteName);
                                                        return (
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="h-7 w-7 rounded-lg bg-white dark:bg-zinc-800 border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
                                                                    <img
                                                                        src={sellerInfo.logoUrl}
                                                                        alt={sellerInfo.displayName}
                                                                        className="h-5 w-5 object-contain"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            if (!target.dataset.fallback) {
                                                                                target.dataset.fallback = '1';
                                                                                const domain = seller.siteName.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                                                                                target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                                                                            } else {
                                                                                target.style.display = 'none';
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="font-medium text-sm">{sellerInfo.displayName}</span>
                                                                {idx === 0 && (
                                                                    <Badge className="text-[10px] bg-suzgec-success border-0 text-white px-1.5 py-0">
                                                                        En Ucuz
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="py-3 px-5 max-md:px-3">
                                                    <span className={`font-semibold ${idx === 0 ? "text-suzgec-primary" : ""}`}>
                                                        {(seller.price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₺
                                                    </span>
                                                </td>
                                                <td className="py-3 px-5 text-muted-foreground text-xs max-md:hidden">
                                                    {seller.freeShipping ? (
                                                        <span className="text-suzgec-success font-medium">Ücretsiz</span>
                                                    ) : (
                                                        <span>Ücretli</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-5 text-center max-md:hidden">
                                                    {seller.isOutlet ? (
                                                        <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-950/30">
                                                            2. El
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">
                                                            Sıfır
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="py-3 px-5 max-md:px-3 text-right">
                                                    {seller.buyUrl ? (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAdUrlClick(seller)}
                                                            disabled={redirectingSeller === seller.siteName}
                                                            className="h-7 text-xs rounded-lg bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:scale-105 active:scale-95 transition-all text-white shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] hover:shadow-[0_6px_20px_rgba(107,33,168,0.4)] min-w-[80px]"
                                                        >
                                                            {redirectingSeller === seller.siteName ? (
                                                                <span className="flex items-center gap-1">
                                                                    <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                                                                    Bekleyin
                                                                </span>
                                                            ) : (
                                                                <>Git <ExternalLink className="h-3 w-3 ml-1" /></>
                                                            )}
                                                        </Button>
                                                    ) : (
                                                        <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs rounded-lg"
                                                            >
                                                                Epey <ExternalLink className="h-3 w-3 ml-1" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {(!product.sellers || product.sellers.length === 0) && (
                                            <tr className="border-t border-border/50">
                                                <td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">
                                                    Satıcı bilgisi henüz yüklenmedi.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                        {}
                        <ProductReviews productId={product._id || product.id} />
                </motion.div>
                {}
                    <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                >
                        <Card className="border-border/50">
                            <div className="px-4 py-1.5 border-b border-border/50">
                                <h2 className="text-sm font-semibold">Teknik Özellikler</h2>
                            </div>
                            <div className="grid grid-cols-1">
                                {product.specs && Object.entries(product.specs).map(([key, value], i) => (
                                    <div
                                        key={key}
                                        className={`px-4 py-2.5 flex flex-col gap-0.5 ${i % 2 === 0
                                            ? "bg-muted/30"
                                            : "bg-transparent"
                                            }`}
                                    >
                                        <span className="text-xs text-muted-foreground">{key}</span>
                                        <span className="text-sm font-medium">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                </motion.div>
            </div>
            <AddPriceAlertDialog 
                productId={product._id || product.id}
                isOpen={isPriceAlertOpen}
                onOpenChange={setIsPriceAlertOpen}
                initialPrice={product.currentPrice}
                productName={product.name}
            />
            {product && (
                <ShareProductDialog 
                    isOpen={isShareOpen}
                    onOpenChange={setIsShareOpen}
                    product={product}
                />
            )}
        </div>
    )
}
