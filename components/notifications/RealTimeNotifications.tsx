"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // Using toast directly from sonner package

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        const withDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(withDates);
        setUnreadCount(withDates.filter((n: Notification) => !n.read).length);
      } catch (e) {
        console.error("Failed to parse notifications", e);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10 notifications

    // Show toast notification
    toast(notification.title, {
      description: notification.message,
      action: notification.action ? {
        label: notification.action.label,
        onClick: notification.action.onClick
      } : undefined
    });
  }, []);

  // Initialize notifications
  useEffect(() => {
    // Only add a welcome notification if the user has no notifications
    if (notifications.length === 0) {
      addNotification({
        title: "Welcome to MR5 School!",
        message: "Explore our courses and start learning today.",
        type: "info"
      });
    }
  }, [addNotification, notifications.length]); // Run once on mount if empty

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-500/20 bg-green-500/10";
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/10";
      case "error":
        return "border-red-500/20 bg-red-500/10";
      default:
        return "border-blue-500/20 bg-blue-500/10";
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex gap-2">
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 px-2 text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                  <p className="text-sm mt-1">We&#39;ll notify you when something important happens</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-b border-border last:border-b-0 ${getTypeColor(notification.type)} ${!notification.read ? "bg-muted/50" : ""}`}
                    >
                      <div className="p-4 relative">
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted text-muted-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>

                        <div className="flex gap-3">
                          <div className="flex-shrink-0 pt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>

                            {notification.action && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 mt-2 text-primary hover:no-underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action?.onClick();
                                  markAsRead(notification.id);
                                }}
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>

                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="absolute bottom-2 right-8 text-xs text-primary hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-border flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-8 px-2 text-xs"
                >
                  Clear all
                </Button>
                <span className="text-xs text-muted-foreground">
                  {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}