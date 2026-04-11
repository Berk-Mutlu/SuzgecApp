"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/context/ToastContext"
import { Share2, Copy, Check, MessageCircle, Link as LinkIcon } from "lucide-react"

interface ShareProductDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    product: {
        name: string
        _id?: string
        id?: string
    }
}

export function ShareProductDialog({ isOpen, onOpenChange, product }: ShareProductDialogProps) {
    const { showToast } = useToast()
    const [isCopied, setIsCopied] = useState(false)

    
    const productId = product._id || product.id
    const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/urun/${productId}`
        : `https://suzgec.com/urun/${productId}`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setIsCopied(true)
            showToast("Bağlantı kopyalandı!", "success")
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            showToast("Kopyalama başarısız oldu.", "error")
        }
    }

    const shareOnWhatsApp = () => {
        const text = encodeURIComponent(`Şu ürüne Süzgeç'te göz at: ${product.name} ${shareUrl}`)
        window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Share2 className="h-5 w-5 text-suzgec-primary" />
                        Paylaş
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Bağlantıyı Kopyala</p>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input 
                                    readOnly 
                                    value={shareUrl} 
                                    className="pr-12 rounded-xl bg-muted/30 border-border/50 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                                    <LinkIcon className="h-4 w-4 text-muted-foreground/50" />
                                </div>
                            </div>
                            <Button 
                                onClick={handleCopy}
                                size="icon"
                                className={`rounded-xl shrink-0 transition-all ${
                                    isCopied 
                                        ? "bg-suzgec-success hover:bg-suzgec-success text-white" 
                                        : "bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white hover:opacity-90 shadow-sm shadow-suzgec-primary/20"
                                }`}
                            >
                                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-border/50 pt-5">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Sosyal Ağlarda Paylaş</p>
                        <div className="flex">
                            <button 
                                onClick={shareOnWhatsApp}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border/50 bg-white dark:bg-zinc-900 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
                            >
                                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                                <span className="text-sm font-medium group-hover:text-[#25D366]">WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
