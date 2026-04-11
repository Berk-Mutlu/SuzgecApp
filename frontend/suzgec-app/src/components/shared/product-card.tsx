"use client"
import { motion } from "framer-motion"
import { Heart, Bell, ExternalLink, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { useState } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
import { AddToListDialog } from "@/components/list/AddToListDialog"
import { AddPriceAlertDialog } from "@/components/alerts/AddPriceAlertDialog"
function formatPrice(price: number): string {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price || 0);
}
interface ProductCardProps {
    product: any
    index?: number
    compact?: boolean
}
export function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [isAddListOpen, setIsAddListOpen] = useState(false)
    const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false)
    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsAddListOpen(true)
    }
    const handleAlert = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsPriceAlertOpen(true)
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <Link href={`/urun/${product._id || product.id}`} className="block">
                <Card className="group relative overflow-hidden border-border/50 hover:border-suzgec-primary/30 hover:shadow-xl hover:shadow-suzgec-primary/5 transition-all duration-300 cursor-pointer p-0">
                    {}
                    {product.condition === "used" && (
                        <Badge className="absolute top-3 right-3 z-10 bg-suzgec-warning text-black border-0 text-xs font-semibold">
                            2. El
                        </Badge>
                    )}
                    {}
                    {product.priceChange && product.priceChange < 0 && (
                        <Badge className="absolute top-3 left-3 z-10 bg-suzgec-success border-0 text-white text-xs font-semibold">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            %{Math.abs(product.priceChange).toFixed(1)}
                        </Badge>
                    )}
                    {}
                    <div className={`relative ${compact ? 'h-[120px]' : 'h-[160px]'} max-md:h-[120px] bg-gradient-to-br from-secondary/80 to-muted overflow-hidden flex items-center justify-center shrink-0`}>
                        {}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-4xl opacity-30">
                                {product.category === "Telefon" ? "📱" :
                                    product.category === "Bilgisayar" ? "💻" :
                                        product.category === "Televizyon" ? "📺" :
                                            product.category === "Kulaklık" ? "🎧" :
                                                product.category === "Oyun Konsolu" ? "🎮" : "📦"}
                            </div>
                        </div>
                        {(product.imageUrl || product.image) && (
                            <img 
                                src={product.imageUrl || product.image} 
                                alt={product.name}
                                className="w-full h-full object-contain relative z-10 p-2 group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.opacity = '0';
                                }}
                            />
                        )}
                        {}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                    </div>
                    {}
                    <div className="p-3 space-y-1.5 max-md:p-2 max-md:space-y-1 flex-1 flex flex-col">
                        <h3 className="font-semibold text-[13px] leading-tight line-clamp-2 h-9 max-md:text-[11px] max-md:h-7 group-hover:text-suzgec-primary transition-colors overflow-hidden">
                            {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground min-h-[1rem] max-md:text-[10px] max-md:min-h-0 max-md:line-clamp-1">
                            {product.priceInfo || product.seller?.replace(/^Epey\s*\(?/, '(').replace(/^\(/, '') || ''}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-base max-md:text-sm font-bold text-suzgec-primary">
                                {formatPrice(product.price || product.currentPrice)} ₺
                            </span>
                            {product.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice)} ₺
                                </span>
                            )}
                        </div>
                        {}
                        <div className="flex items-center gap-2 pt-2 max-md:pt-1 max-md:gap-1.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg border-border/50 hover:border-suzgec-primary/50 hover:text-suzgec-primary"
                                        onClick={handleLike}
                                        disabled={loading}
                                    >
                                        <Heart className={`h-3.5 w-3.5 ${loading ? "animate-pulse" : ""}`} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Listeye Ekle</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg border-border/50 hover:border-suzgec-warning/50 hover:text-suzgec-warning"
                                        onClick={handleAlert}
                                    >
                                        <Bell className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Fiyat Alarmı</TooltipContent>
                            </Tooltip>
                            <Button
                                size="sm"
                                className="ml-auto h-8 rounded-lg bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:scale-105 active:scale-95 transition-all duration-300 text-white text-xs shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] hover:shadow-[0_6px_20px_rgba(107,33,168,0.4)]"
                            >
                                Git
                                <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </Link>
            <AddToListDialog 
                productId={product._id || product.id}
                isOpen={isAddListOpen}
                onOpenChange={setIsAddListOpen}
                productName={product.name}
            />
            <AddPriceAlertDialog 
                productId={product._id || product.id}
                isOpen={isPriceAlertOpen}
                onOpenChange={setIsPriceAlertOpen}
                initialPrice={product.price || product.currentPrice}
                productName={product.name}
            />
        </motion.div>
    )
}
