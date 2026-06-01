'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import type { NotificationItem } from '@/types';

/* ─────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────── */

interface SocketContextValue {
  /** Raw socket instance for custom events */
  socket: Socket | null;
  /** Whether the socket is currently connected */
  isConnected: boolean;
  /** All notifications received this session (newest first) */
  notifications: NotificationItem[];
  /** Number of unread notifications */
  unreadCount: number;
  /** Mark all notifications as read */
  markAllRead: () => void;
  /** Dismiss / remove a single notification by id */
  dismiss: (id: string) => void;
}

/* ─────────────────────────────────────────────────────────────────────────
   Context
───────────────────────────────────────────────────────────────────────── */

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  dismiss: () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

/* ─────────────────────────────────────────────────────────────────────────
   Provider
───────────────────────────────────────────────────────────────────────── */

const WS_URL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1')
    .replace('/api/v1', ''); // strip REST prefix → base server URL

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  /* ── computed ── */
  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ── Connect / disconnect based on token ── */
  useEffect(() => {
    const token = Cookies.get('auth_token');

    // Don't open socket if there's no token (user not logged in)
    if (!token) return;

    const socket = io(`${WS_URL}/notifications`, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] connect_error:', err.message);
      setIsConnected(false);
    });

    /* ── Incoming notification events ── */
    socket.on('notification', (payload: NotificationItem) => {
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
    // Re-run when login/logout changes the cookie
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Mark all read ── */
  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  /* ── Dismiss one ── */
  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected, notifications, unreadCount, markAllRead, dismiss }}
    >
      {children}
    </SocketContext.Provider>
  );
}
