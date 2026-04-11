"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
    Home,
    Heart,
    BarChart3,
    Package,
    Bell,
    TrendingDown,
    Settings,
    History,
} from "lucide-react"
const sidebarLinks = [
    { href: "/", label: "Ana Menü", icon: Home },
    { href: "/listelerim", label: "Listelerim", icon: Heart },
    { href: "/karsilastirma", label: "Karşılaştırmalar", icon: BarChart3 },
    { href: "/stok-takibi", label: "Stok Takibi", icon: Package },
    { href: "/fiyat-takibi", label: "Fiyat Alarmları", icon: TrendingDown },
    { href: "/bildirimler", label: "Bildirimler", icon: Bell },
]
export function Sidebar() {
    const pathname = usePathname()
    return (
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border bg-card shadow-sm sticky top-16 h-[calc(100vh-4rem)]">
            <nav className="flex flex-col gap-2 p-3 pt-6">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href)
                    return (
                        <Link key={link.href} href={link.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white shadow-[0_4px_14px_0_rgba(107,33,168,0.25)]"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{link.label}</span>
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
