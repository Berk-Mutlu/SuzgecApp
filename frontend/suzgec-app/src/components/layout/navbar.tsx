"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Search,
    Bell,
    User,
    Menu,
    X,
    Heart,
    BarChart3,
    Package,
    LogIn,
    LogOut,
    Clock,
    Settings,
    TrendingDown,
    Tag,
    ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useNotifications } from "@/context/NotificationContext"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
const navLinks = [
    { href: "/", label: "Ana Sayfa", icon: Search },
    { href: "/listelerim", label: "Listelerim", icon: Heart },
    { href: "/karsilastirma", label: "Karşılaştırma", icon: BarChart3 },
    { href: "/stok-takibi", label: "Stok Takibi", icon: Package },
    { href: "/fiyat-takibi", label: "Fiyat Alarmları", icon: TrendingDown },
    { href: "/bildirimler", label: "Bildirimler", icon: Bell },
]
export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { unreadCount } = useNotifications()
    const [searchQuery, setSearchQuery] = useState("")
    const [mobileOpen, setMobileOpen] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [navNotifications, setNavNotifications] = useState<any[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token')
            const userStr = localStorage.getItem('user')
            if (token && userStr) {
                setIsLoggedIn(true)
                try {
                    const userData = JSON.parse(userStr)
                    const displayName = (userData.firstName || userData.lastName)
                        ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                        : (userData.name || userData.username || "Kullanıcı")
                    setUserName(displayName)
                } catch (e) {
                    setUserName("Kullanıcı")
                }
            } else {
                setIsLoggedIn(false)
                setUserName(null)
            }
        }
        checkAuth()
        const fetchHistory = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const res = await api.getSearchHistory()
                    if (res.error) {
                        console.error("History API returned error:", res.error);
                    }
                    const data = res.data || (Array.isArray(res) ? res : [])
                    if (data.length > 0 && !res.error) {
                        setRecentSearches(data.slice(0, 5).map((d: any) => d.query))
                    }
                } catch (e) {
                    console.error("History fetch error:", e)
                }
            } else {
                const localHistory = localStorage.getItem('guest_search_history')
                if (localHistory) setRecentSearches(JSON.parse(localHistory))
            }
        }
        fetchHistory()

        // Fetch notifications for dropdown
        const fetchNavNotifications = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const res = await api.getNotifications()
                    const data = Array.isArray(res) ? res : []
                    setNavNotifications(data.slice(0, 5))
                } catch (e) {
                    console.error("Nav notifications fetch error:", e)
                }
            } else {
                setNavNotifications([])
            }
        }
        fetchNavNotifications()

        window.addEventListener('storage', checkAuth)
        return () => window.removeEventListener('storage', checkAuth)
    }, [pathname])
    useEffect(() => {
        const readQueryFromUrl = () => {
            const params = new URLSearchParams(window.location.search)
            const q = params.get('q')
            if (window.location.pathname.includes('/arama') && q) {
                setSearchQuery(q)
            } else if (!window.location.pathname.includes('/arama')) {
                setSearchQuery("")
            }
        }
        readQueryFromUrl()
        const timer = setTimeout(readQueryFromUrl, 150)
        return () => clearTimeout(timer)
    }, [pathname])
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsLoggedIn(false)
        setUserName(null)
        router.push('/')
        router.refresh()
    }
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            const q = searchQuery.trim()
            setShowHistory(false)
            if (!isLoggedIn) {
                const q = searchQuery.trim()
                const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5)
                if (JSON.stringify(updated) !== JSON.stringify(recentSearches)) {
                    setRecentSearches(updated)
                    localStorage.setItem('guest_search_history', JSON.stringify(updated))
                }
            }
            setSearchQuery(q)
            router.push(`/arama?q=${encodeURIComponent(q)}`)
        }
    }
    const handleHistoryClick = (query: string) => {
        setShowHistory(false)
        setSearchQuery(query)
        router.push(`/arama?q=${encodeURIComponent(query)}`)
    }
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowHistory(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    const filteredHistory = searchQuery.trim()
        ? recentSearches.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
        : recentSearches
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm"
        >
            <div className="w-full px-4 sm:px-6 max-md:px-2">
                <div className="flex items-center h-16 gap-4 max-md:gap-2">
                    {}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <img 
                            src="/logo.png" 
                            alt="Süzgeç Logo" 
                            className="h-10 w-10 object-contain drop-shadow-md rounded-xl bg-white" 
                        />
                        {}
                        <div className="hidden sm:flex flex-col items-start -space-y-1 justify-center ml-1.5 font-black text-transparent bg-clip-text bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6]">
                            <span className="text-[1.15rem] leading-none tracking-tighter">Süz</span>
                            <span className="text-[1.15rem] leading-none tracking-tighter">Geç</span>
                        </div>
                    </Link>
                    {}
                    <div ref={searchRef} className="flex-1 max-w-xl mx-auto relative max-md:mx-0">
                        <form onSubmit={handleSearch}>
                            <div className="relative flex w-full rounded-xl border border-border/60 bg-secondary/40 hover:bg-secondary/60 focus-within:bg-background focus-within:border-suzgec-primary/40 focus-within:shadow-sm transition-all overflow-hidden">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={isMobile ? "Ara..." : "Ürün, marka veya kategori ara..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setShowHistory(true)}
                                    className="pl-10 pr-4 h-10 max-md:h-9 max-md:text-xs border-0 shadow-none focus-visible:ring-0 bg-transparent"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="h-8 px-4 my-1 mr-1 rounded-lg bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] hover:opacity-90 text-white text-xs font-medium shrink-0 shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] max-md:h-7 max-md:w-7 max-md:px-0"
                                >
                                    <Search className="h-3.5 w-3.5 mr-1.5 max-md:mr-0" />
                                    <span className="max-md:hidden">Ara</span>
                                </Button>
                            </div>
                        </form>
                        {}
                        {showHistory && filteredHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                                <div className="px-3 py-2 border-b border-border/50">
                                    <p className="text-[11px] text-muted-foreground font-medium">Son Aramalar</p>
                                </div>
                                {filteredHistory.map((query, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleHistoryClick(query)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                                    >
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                        <span className="truncate">{query}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {}
                    <div className="flex items-center gap-1 max-md:gap-0.5 shrink-0">
                        <div className="max-md:hidden"><ThemeToggle /></div>
                        {}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                                    <Bell className="h-4 w-4" />
                                    {unreadCount > 0 && (
                                        <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-suzgec-danger border-0 text-white flex items-center justify-center">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <div className="px-3 py-2 border-b border-border/50">
                                    <p className="text-sm font-semibold">Bildirimler</p>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {!isLoggedIn ? (
                                        <div className="px-3 py-6 text-center">
                                            <Bell className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
                                            <p className="text-xs text-muted-foreground">Bildirimleri görmek için giriş yapın</p>
                                        </div>
                                    ) : navNotifications.length === 0 ? (
                                        <div className="px-3 py-6 text-center">
                                            <Bell className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
                                            <p className="text-xs text-muted-foreground">Henüz bildiriminiz yok</p>
                                        </div>
                                    ) : (
                                        navNotifications.map((notif) => (
                                            <DropdownMenuItem key={notif._id} asChild className="flex flex-col items-start gap-0.5 px-3 py-2.5 cursor-pointer">
                                                <Link href="/bildirimler">
                                                    <div className="flex items-start gap-2.5 w-full">
                                                        <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${!notif.read ? 'bg-gradient-to-r from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] text-white' : 'bg-muted text-muted-foreground'}`}>
                                                            {notif.type === 'price_drop' ? <Tag className="h-3 w-3" /> : notif.type === 'stock' || notif.type === 'stock_alert' ? <Package className="h-3 w-3" /> : notif.type === 'price_target' ? <ArrowUpRight className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className={`text-sm block truncate ${!notif.read ? 'font-semibold' : ''}`}>{notif.message || notif.productName}</span>
                                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: tr }) : ''}
                                                            </span>
                                                        </div>
                                                        {!notif.read && <div className="h-2 w-2 rounded-full bg-suzgec-primary shrink-0 mt-1.5" />}
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="justify-center">
                                    <Link href="/bildirimler" className="text-xs text-suzgec-primary font-medium text-center w-full">
                                        Tüm Bildirimleri Gör
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-full ${isLoggedIn ? "bg-suzgec-primary/10 text-suzgec-primary" : ""}`}>
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {isLoggedIn ? (
                                    <>
                                        <div className="px-3 py-2.5">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-70">Hesap</p>
                                            <p className="text-sm font-bold truncate mt-1 text-suzgec-primary">{userName}</p>
                                        </div>
                                        <DropdownMenuSeparator className="opacity-50" />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profil" className="gap-2 cursor-pointer w-full">
                                                <User className="h-4 w-4" /> Hesabım
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={handleLogout}
                                            className="gap-2 text-suzgec-danger focus:text-suzgec-danger cursor-pointer"
                                        >
                                            <LogOut className="h-4 w-4" /> Çıkış Yap
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/giris" className="gap-2">
                                                <LogIn className="h-4 w-4" /> Giriş Yap
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/kayit" className="gap-2">
                                                <User className="h-4 w-4" /> Kayıt Ol
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>
            </div>
        </motion.header>
    )
}
