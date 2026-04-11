"use client"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileMenuFab } from "@/components/layout/mobile-menu-fab"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ToastProvider } from "@/context/ToastContext"
import { NotificationProvider } from "@/context/NotificationContext"
export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <ToastProvider>
                <NotificationProvider>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 overflow-x-hidden">
                                {children}
                            </main>
                        </div>
                        <MobileMenuFab />
                    </div>
                </NotificationProvider>
            </ToastProvider>
        </TooltipProvider>
    )
}
