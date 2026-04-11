"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Calendar, Save, Trash2, Shield, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function ProfilePage() {
    const { showToast } = useToast()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    useEffect(() => {
        const fetchUserData = async () => {
            const userStr = localStorage.getItem('user')
            if (!userStr) {
                router.push('/giris')
                return
            }

            try {
                const localUser = JSON.parse(userStr)
                const res = await api.getUserProfile(localUser._id || localUser.id)
                setUser(res)
                setFirstName(res.firstName || "")
                setLastName(res.lastName || "")
                setEmail(res.email || "")
                setPhone(res.phone || "")
            } catch (err) {
                showToast("Profil bilgileri yüklenemedi", "error")
            } finally {
                setLoading(false)
            }
        }
        fetchUserData()
    }, [])

    const handleUpdate = async () => {
        setSaving(true)
        try {
            const res = await api.updateUserProfile(user._id || user.id, {
                firstName,
                lastName,
                email,
                phone
            })

            if (res.message === "Güncelleme başarılı") {
                showToast("Profil başarıyla güncellendi", "success")
                
                const userStr = localStorage.getItem('user')
                if (userStr) {
                    const localUser = JSON.parse(userStr)
                    const updatedUser = { ...localUser, firstName, lastName, email }
                    localStorage.setItem('user', JSON.stringify(updatedUser))
                    
                    window.dispatchEvent(new Event('storage'))
                }
            } else {
                showToast(res.message || "Güncelleme başarısız", "error")
            }
        } catch (err) {
            showToast("Bir hata oluştu", "error")
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteAccount = async () => {
        setSaving(true)
        try {
            const res = await api.deleteUserProfile(user._id || user.id)
            if (res.success || res.status === 204) {
                showToast("Hesabınız kalıcı olarak silindi", "success")
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.dispatchEvent(new Event('storage'))
                router.push('/')
            }
        } catch (err) {
            showToast("Hesap silinirken bir hata oluştu", "error")
        } finally {
            setSaving(false)
            setIsDeleteDialogOpen(false)
        }
    }

    if (loading) {
        return <div className="p-12 text-center text-muted-foreground">Yükleniyor...</div>
    }

    return (
        <div className="px-4 sm:px-6 py-6 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {}
                <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-border/50">
                    <div className="h-24 w-24 rounded-3xl bg-suzgec-primary/10 flex items-center justify-center text-suzgec-primary shadow-xl shadow-suzgec-primary/5">
                        <UserCircle className="h-16 w-16" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold">{firstName} {lastName}</h1>
                        <p className="text-muted-foreground">{email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                            <Badge variant="secondary" className="bg-suzgec-primary/10 text-suzgec-primary border-0">
                                <Shield className="h-3 w-3 mr-1" /> Standart Üye
                            </Badge>
                            <Badge variant="outline">
                                <Calendar className="h-3 w-3 mr-1" /> Katılım: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    <div className="md:col-span-2">
                        <Card className="p-6 h-full flex flex-col shadow-sm border-border/40">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-suzgec-primary" /> Kişisel Bilgiler
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 flex-1">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground/80">Ad</label>
                                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Adınız" className="h-10 border-border/60 focus-visible:ring-suzgec-primary/30" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground/80">Soyad</label>
                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Soyadınız" className="h-10 border-border/60 focus-visible:ring-suzgec-primary/30" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground/80">E-posta</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-10 border-border/60 focus-visible:ring-suzgec-primary/30" placeholder="E-posta" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground/80">Telefon</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-10 border-border/60 focus-visible:ring-suzgec-primary/30" placeholder="Telefon" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <Button 
                                    onClick={handleUpdate} 
                                    className="bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white hover:opacity-90 h-11 px-8 rounded-xl shadow-lg shadow-suzgec-primary/20 transition-all font-semibold"
                                    disabled={saving}
                                >
                                    {saving ? "Kaydediliyor..." : <><Save className="h-4 w-4 mr-2" /> Değişiklikleri Kaydet</>}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {}
                    <div>
                        <Card className="p-6 border-suzgec-danger/20 bg-suzgec-danger/5 shadow-sm h-full flex flex-col">
                            <h2 className="text-xl font-bold mb-4 text-suzgec-danger flex items-center gap-2">
                                <Trash2 className="h-5 w-5" /> Hesap Silme
                            </h2>
                            <p className="text-sm text-muted-foreground mb-8 flex-1">
                                Hesabınızı silmek tüm verilerinizi (listeler, alarmlar, arama geçmişi) kalıcı olarak kaldıracaktır. Bu işlem geri alınamaz ve tüm kişisel verileriniz sunucularımızdan temizlenecektir.
                            </p>
                            <Button
                                variant="destructive"
                                className="w-full bg-suzgec-danger hover:bg-suzgec-danger/90 text-white shadow-lg shadow-suzgec-danger/20 transition-all font-semibold h-11 rounded-xl"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                Hesabımı Sil
                            </Button>
                        </Card>
                    </div>
                </div>
            </motion.div>

            {}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-suzgec-danger">Hesabınızı Silmek İstediğinize Emin Misiniz?</DialogTitle>
                        <DialogDescription className="pt-2">
                            Bu işlem geri alınamaz. Tüm listeleriniz, fiyat alarmlarınız ve arama geçmişiniz kalıcı olarak silinecektir.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 flex gap-3">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>Vazgeç</Button>
                        <Button
                            variant="destructive"
                            className="bg-suzgec-danger hover:bg-suzgec-danger/90 text-white"
                            onClick={handleDeleteAccount}
                            disabled={saving}
                        >
                            {saving ? "Siliniyor..." : "Evet, Hesabımı Sil"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
