"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const isDark = theme === "dark"
    if (!mounted) {
        return <div className="w-14 h-7 rounded-full bg-muted" />
    }
    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${isDark
                    ? "bg-indigo-900/80 shadow-inner"
                    : "bg-sky-200 shadow-inner"
                }`}
            aria-label="Tema değiştir"
        >
            {}
            <div className="absolute inset-0 rounded-full overflow-hidden">
                {}
                <div className={`absolute transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-0"}`}>
                    <div className="absolute top-1.5 left-2 w-0.5 h-0.5 bg-white rounded-full" />
                    <div className="absolute top-3 left-4 w-[3px] h-[3px] bg-white/80 rounded-full" />
                    <div className="absolute top-1 left-6 w-0.5 h-0.5 bg-white/60 rounded-full" />
                </div>
                {}
                <div className={`absolute transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100"}`}>
                    <div className="absolute top-3.5 right-3 w-3 h-1.5 bg-white/50 rounded-full" />
                    <div className="absolute top-2.5 right-4 w-2 h-1 bg-white/40 rounded-full" />
                </div>
            </div>
            {}
            <motion.div
                className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center ${isDark
                        ? "bg-indigo-200"
                        : "bg-amber-300"
                    }`}
                animate={{ x: isDark ? 30 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {isDark ? (
                    <Moon className="h-3.5 w-3.5 text-indigo-700" />
                ) : (
                    <Sun className="h-3.5 w-3.5 text-amber-600" />
                )}
            </motion.div>
        </button>
    )
}
