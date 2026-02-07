// src/components/notifications.tsx
"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export type Notification = {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
  time?: string;
  read?: boolean;
};

const NotificationContext = React.createContext<{
  notify: (n: Omit<Notification, "id">) => void;
  notifications: Notification[];
  remove: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
} | null>(null);

export function useNotifications() {
  const ctx = React.useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

export function NotificationsProvider({
  children,
  initialNotifications,
}: {
  children: React.ReactNode;
  initialNotifications?: Notification[];
}) {
  const [notifications, setNotifications] = React.useState<Notification[]>(
    () => initialNotifications ?? []
  );

  const notify = React.useCallback((n: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setNotifications((prev) => [
      ...prev,
      { ...n, id, time: new Date().toLocaleTimeString(), read: false },
    ]);
    setTimeout(() => setNotifications((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <NotificationContext.Provider value={{ notify, notifications, remove, markRead, markAllRead }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 text-sm bg-background border",
              n.type === "success" && "border-green-500 text-green-700",
              n.type === "error" && "border-red-500 text-red-700",
              n.type === "info" && "border-blue-500 text-blue-700"
            )}
            onClick={() => remove(n.id)}
            role="alert"
          >
            <Bell className="w-4 h-4" />
            <span>{n.message}</span>
            <span className="ml-auto text-xs text-muted-foreground">{n.time}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function NotificationBell() {
  const { notifications, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-muted"
        onClick={() => {
          setOpen((v) => !v);
          if (unreadCount > 0) markAllRead();
        }}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-xs bg-background border rounded-lg shadow-lg z-50">
          <div className="p-3 font-semibold border-b flex items-center justify-between">
            <span>Notifications</span>
            <button
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllRead}
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-64 overflow-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-muted-foreground text-sm">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "px-4 py-2 border-b last:border-b-0 flex items-center gap-2 text-sm cursor-pointer hover:bg-muted",
                    !n.read && "bg-muted/40",
                    n.type === "success" && "text-green-700",
                    n.type === "error" && "text-red-700",
                    n.type === "info" && "text-blue-700"
                  )}
                  onClick={() => markRead(n.id)}
                >
                  <Bell className="w-4 h-4" />
                  <span>{n.message}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{n.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
