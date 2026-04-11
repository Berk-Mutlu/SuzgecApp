"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, MessageSquare, Send, User, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"

interface Review {
    _id: string
    user: { _id?: string, id?: string, firstName: string, lastName: string }
    rating: number
    comment: string
    createdAt: string
}

export function ProductReviews({ productId }: { productId: string }) {
    const { showToast } = useToast()
    const router = useRouter()
    
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    
    
    const [isWriting, setIsWriting] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [submitLoading, setSubmitLoading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [confirmModal, setConfirmModal] = useState<{type: 'edit'|'delete', id: string, rating?: number, comment?: string} | null>(null)

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try { setCurrentUser(JSON.parse(userStr).user || JSON.parse(userStr)) } catch(e){}
        }
        fetchReviews()
    }, [productId])

    const fetchReviews = async () => {
        try {
            const res = await api.getProductReviews(productId)
            if (res.success) {
                setReviews(res.data)
            }
        } catch (error) {
            console.error("Yorumlar yüklenemedi", error)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setRating(0)
        setComment("")
        setIsWriting(false)
        setEditingId(null)
    }

    const handleSubmit = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            showToast("Yorum yapmak için giriş yapmalısınız.", "error")
            router.push('/giris?returnUrl=' + encodeURIComponent(window.location.pathname))
            return
        }

        if (rating === 0) {
            showToast("Lütfen bir yıldız puanı seçin.", "error")
            return
        }

        setSubmitLoading(true)
        try {
            let res;
            if (editingId) {
                res = await api.updateReview(editingId, rating, comment)
            } else {
                res = await api.addReview(productId, rating, comment)
            }
            
            if (res.success) {
                showToast(editingId ? "Değerlendirmeniz güncellendi!" : "Değerlendirmeniz başarıyla eklendi!", "success")
                resetForm()
                fetchReviews() 
            } else {
                showToast(res.message || "Bir hata oluştu.", "error")
            }
        } catch (error) {
            showToast("İşlem başarısız oldu.", "error")
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const res = await api.deleteReview(reviewId)
            if (res.success) {
                showToast("Değerlendirme silindi.", "success")
                fetchReviews()
            } else {
                showToast("Silinemedi.", "error")
            }
        } catch (e) {}
    }

    const executeConfirmAction = () => {
        if (!confirmModal) return;
        if (confirmModal.type === 'delete') {
            handleDeleteReview(confirmModal.id);
        } else if (confirmModal.type === 'edit') {
            setEditingId(confirmModal.id);
            setRating(confirmModal.rating || 0);
            setComment(confirmModal.comment || "");
            setIsWriting(true);
        }
        setConfirmModal(null);
    }

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0

    return (
        <Card className="p-6 border-border/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-suzgec-primary" />
                        Ürün Değerlendirmeleri
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerçek kullanıcı deneyimleri ve puanlamalar
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-muted/30 px-4 py-2 rounded-2xl border border-border/40">
                    <div className="text-3xl font-extrabold text-suzgec-primary">
                        {avgRating}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${Number(avgRating) >= star ? "fill-current" : "text-muted-foreground/30"}`} 
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium mt-0.5">
                            {reviews.length} Değerlendirme
                        </span>
                    </div>
                </div>
            </div>

            {}
            <div className="mb-8">
                {!isWriting ? (
                    <Button 
                        onClick={() => setIsWriting(true)}
                        className="w-full md:w-auto rounded-xl bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white shadow-md hover:shadow-lg transition-all"
                    >
                        Değerlendirme Yaz
                    </Button>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-accent/20 p-5 rounded-2xl border border-border/50"
                    >
                        <h3 className="font-semibold text-sm mb-3">Puanınız</h3>
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 active:scale-90 p-1"
                                >
                                    <Star 
                                        className={`h-8 w-8 transition-colors ${
                                            (hoverRating || rating) >= star 
                                                ? "fill-amber-500 text-amber-500" 
                                                : "fill-transparent text-muted-foreground/30"
                                        }`} 
                                    />
                                </button>
                            ))}
                        </div>
                        
                        <h3 className="font-semibold text-sm mb-2">Yorumunuz (İsteğe bağlı)</h3>
                        <textarea 
                            placeholder="Ürün hakkındaki tecrübelerinizi diğer Süz-Geç kullanıcılarıyla paylaşın..."
                            className="flex w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none h-24 rounded-xl border-border/50 focus-visible:ring-suzgec-primary/30 mb-4 bg-background"
                            value={comment}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                        />
                        
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" className="rounded-xl" onClick={resetForm}>İptal</Button>
                            <Button 
                                onClick={handleSubmit} 
                                disabled={submitLoading || rating === 0}
                                className="rounded-xl bg-[#6b21a8] text-white hover:bg-[#581c87]"
                            >
                                {submitLoading ? "Gönderiliyor..." : (editingId ? "Güncelle" : "Gönder")}
                                {!submitLoading && <Send className="h-4 w-4 ml-2" />}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            {}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-8 text-center text-muted-foreground animate-pulse">Yorumlar yükleniyor...</div>
                ) : reviews.length === 0 ? (
                    <div className="py-12 bg-muted/10 rounded-2xl border border-dashed border-border/60 text-center">
                        <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                        <h3 className="font-medium">Henüz Değerlendirme Yok</h3>
                        <p className="text-sm text-muted-foreground mt-1">Bu ürün için ilk değerlendirmeyi siz yapın.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {reviews.map((review, i) => (
                            <motion.div 
                                key={review._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4 rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6b21a8]/20 to-[#3b82f6]/20 flex items-center justify-center border border-[#6b21a8]/10 text-[#6b21a8]">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm flex items-center gap-2">
                                                {review.user?.firstName} {review.user?.lastName?.[0]}.
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(review.createdAt).toLocaleDateString("tr-TR", {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex text-amber-500">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star} 
                                                    className={`h-3 w-3 ${review.rating >= star ? "fill-current" : "text-muted-foreground/20"}`} 
                                                />
                                            ))}
                                        </div>
                                        {currentUser && (currentUser._id === review.user?._id || currentUser.id === review.user?._id) && (
                                            <div className="flex items-center gap-2 mt-1 -mr-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 text-muted-foreground hover:text-suzgec-primary"
                                                    onClick={() => setConfirmModal({ type: 'edit', id: review._id, rating: review.rating, comment: review.comment })}
                                                    title="Düzenle"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setConfirmModal({ type: 'delete', id: review._id })}
                                                    title="Sil"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {review.comment && (
                                    <div className="mt-4 text-sm leading-relaxed text-foreground/90 pl-[52px]">
                                        {review.comment}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <Dialog open={!!confirmModal} onOpenChange={(open) => !open && setConfirmModal(null)}>
                <DialogContent className="sm:max-w-md border-border/50 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Emin misiniz?</DialogTitle>
                        <DialogDescription className="text-base mt-2">
                            {confirmModal?.type === 'delete' 
                                ? "Bu değerlendirmeyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
                                : "Bu değerlendirmeyi düzenlemek istediğinize emin misiniz? Önceki puanınız düzenleme ekranında belirecektir."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex items-center justify-end gap-3 sm:gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => setConfirmModal(null)}>İptal</Button>
                        <Button 
                            className={`rounded-xl text-white ${confirmModal?.type === 'delete' ? 'bg-destructive hover:bg-destructive/90' : 'bg-suzgec-primary hover:bg-suzgec-primary/90'}`}
                            onClick={executeConfirmAction}
                        >
                            Evet, Onaylıyorum
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
