import Link from "next/link"
export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-card/30 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {}
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#6b21a8] via-[#4f46e5] to-[#3b82f6] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="text-lg font-bold gradient-text">Süzgeç</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            En uygun fiyatı bul, karşılaştır, takip et ve tasarruf et.
                        </p>
                    </div>
                    {}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Kategoriler</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/arama?q=telefon" className="hover:text-foreground transition-colors">Telefonlar</Link></li>
                            <li><Link href="/arama?q=bilgisayar" className="hover:text-foreground transition-colors">Bilgisayarlar</Link></li>
                            <li><Link href="/arama?q=televizyon" className="hover:text-foreground transition-colors">Televizyonlar</Link></li>
                            <li><Link href="/arama?q=kulaklik" className="hover:text-foreground transition-colors">Kulaklıklar</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Hesabım</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/listelerim" className="hover:text-foreground transition-colors">Listelerim</Link></li>
                            <li><Link href="/stok-takibi" className="hover:text-foreground transition-colors">Stok Takibi</Link></li>
                            <li><Link href="/fiyat-takibi" className="hover:text-foreground transition-colors">Fiyat Alarmları</Link></li>
                            <li><Link href="/bildirimler" className="hover:text-foreground transition-colors">Bildirimler</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2026 Süzgeç. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>🇹🇷 Türkiye&apos;de tasarlandı</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
