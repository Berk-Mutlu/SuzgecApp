"use client"
import { motion } from "framer-motion"
import { LogIn, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/context/ToastContext"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { showToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { api } = await import("@/lib/api")
            const res = await api.login({ 
                email: email.trim().toLowerCase(), 
                password 
            })
            if (res.success) {
                showToast("Giriş başarılı! Yönlendiriliyorsunuz...", "success")
                const params = new URLSearchParams(window.location.search);
                const returnUrl = params.get('returnUrl');
                setTimeout(() => {
                    if (returnUrl && returnUrl.startsWith('/')) {
                        window.location.href = returnUrl;
                    } else {
                        window.location.href = "/";
                    }
                }, 500)
            } else {
                const msg = res.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
                setError(msg)
                showToast(msg, "error")
            }
        } catch (err) {
            const msg = "Bir hata oluştu. Lütfen tekrar deneyin."
            setError(msg)
            showToast(msg, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="p-6 sm:p-8 border-border/50 shadow-2xl shadow-suzgec-primary/5 relative overflow-hidden">
                    {}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-suzgec-primary via-suzgec-secondary to-suzgec-accent" />

                    <div className="text-center mb-6">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-suzgec-primary/25">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <h1 className="text-xl font-bold">Giriş Yap</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Süzgeç hesabınıza giriş yapın
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">E-posta</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    className="pl-10 h-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-medium">Şifre</label>
                                <Link href="#" className="text-xs text-suzgec-primary hover:underline">
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white hover:opacity-90 font-medium"
                        >
                            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                            {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Hesabınız yok mu?{" "}
                        <Link href="/kayit" className="text-suzgec-primary font-medium hover:underline">
                            Kayıt Olun
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    )
}
