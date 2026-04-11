"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Menu,
    X,
    Home,
    Heart,
    BarChart3,
    Package,
    TrendingDown,
    Bell,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const menuLinks = [
    { href: "/", label: "Ana Menü", icon: Home },
    { href: "/listelerim", label: "Listelerim", icon: Heart },
    { href: "/karsilastirma", label: "Karşılaştırmalar", icon: BarChart3 },
    { href: "/stok-takibi", label: "Stok Takibi", icon: Package },
    { href: "/fiyat-takibi", label: "Fiyat Alarmları", icon: TrendingDown },
    { href: "/bildirimler", label: "Bildirimler", icon: Bell },
]

export function MobileMenuFab() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Sadece mobilde görünür — masaüstünde tamamen gizli */}
            <div className="lg:hidden">
                {/* Backdrop */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Panel — alttan yukarı baloncuk gibi açılır */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-20 left-4 right-4 z-[61] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden"
                        >
                            {/* Panel Header */}
                            <div className="px-5 pt-5 pb-3 border-b border-border/40">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src="/logo.png"
                                            alt="Süzgeç"
                                            className="h-8 w-8 rounded-lg"
                                        />
                                        <div className="font-black text-transparent bg-clip-text bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6]">
                                            <span className="text-base">SüzGeç</span>
                                        </div>
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </div>

                            {/* Menu Links */}
                            <nav className="p-3 grid grid-cols-3 gap-2">
                                {menuLinks.map((link) => {
                                    const Icon = link.icon
                                    const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href)
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center transition-all duration-200 ${
                                                isActive
                                                    ? "bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white shadow-[0_4px_14px_0_rgba(107,33,168,0.25)]"
                                                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-[11px] font-medium leading-tight">{link.label}</span>
                                        </Link>
                                    )
                                })}
                            </nav>

                            {/* Alt bilgi */}
                            <div className="px-5 pb-4 pt-1">
                                <p className="text-[10px] text-muted-foreground/50 text-center">
                                    En uygun fiyatı bul · SüzGeç
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FAB Button — sol alt köşe */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`fixed bottom-5 left-5 z-[62] h-12 w-12 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(107,33,168,0.3)] transition-all duration-300 ${
                        isOpen
                            ? "bg-card border border-border/60 text-foreground rotate-90"
                            : "bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white"
                    }`}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.button>
            </div>
        </>
    )
}
