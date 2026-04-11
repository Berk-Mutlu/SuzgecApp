"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

interface NotificationContextType {
    unreadCount: number
    refreshUnreadCount: () => Promise<void>
    loading: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const refreshUnreadCount = useCallback(async () => {
        setLoading(true)
        try {
            const notifications = await api.getNotifications()
            if (Array.isArray(notifications)) {
                const count = notifications.filter(n => !n.read).length
                setUnreadCount(count)
            }
        } catch (err) {
            console.error("Failed to fetch unread count:", err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        
        refreshUnreadCount()

        
        const interval = setInterval(refreshUnreadCount, 60000)
        return () => clearInterval(interval)
    }, [refreshUnreadCount])

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, loading }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}
