'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import type { NotificationItem } from '@/types';

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_STYLES: Record<NotificationItem['type'], { dot: string; bg: string }> = {
  info:    { dot: 'bg-blue-500',   bg: 'bg-blue-50 border-blue-100' },
  success: { dot: 'bg-green-500',  bg: 'bg-green-50 border-green-100' },
  warning: { dot: 'bg-yellow-500', bg: 'bg-yellow-50 border-yellow-100' },
  boarding:{ dot: 'bg-purple-500', bg: 'bg-purple-50 border-purple-100' },
};

const TYPE_ICONS: Record<NotificationItem['type'], string> = {
  info:    'ℹ️',
  success: '✅',
  warning: '⚠️',
  boarding:'🏠',
};

/* ─────────────────────────────────────────────────────────────────────────
   Toast — floating pop-up for the most recent notification
───────────────────────────────────────────────────────────────────────── */

function NotificationToast({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const styles = TYPE_STYLES[item.type] ?? TYPE_STYLES.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl
                  backdrop-blur-sm animate-slide-in max-w-sm
                  ${styles.bg}`}
    >
      <span className="text-xl shrink-0 mt-0.5">{TYPE_ICONS[item.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Dropdown — full notification list
───────────────────────────────────────────────────────────────────────── */

function NotificationDropdown({
  notifications,
  onMarkAllRead,
  onDismiss,
  onClose,
}: {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl
                 border border-gray-100 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-3xl mb-2">🔔</p>
            <p className="text-sm text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => {
            const styles = TYPE_STYLES[n.type] ?? TYPE_STYLES.info;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 transition hover:bg-gray-50
                            ${n.read ? 'opacity-60' : ''}`}
              >
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${styles.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                <button
                  onClick={() => onDismiss(n.id)}
                  className="text-gray-300 hover:text-gray-500 transition text-base shrink-0"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 text-center">
            Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main export — the bell button + dropdown + toasts
───────────────────────────────────────────────────────────────────────── */

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, dismiss, isConnected } = useSocket();
  const [open, setOpen] = useState(false);

  // Track the last notification ID we showed as a toast
  const lastToastIdRef = useRef<string | null>(null);
  const [toast, setToast] = useState<NotificationItem | null>(null);

  // Pop a toast whenever a new (unread) notification arrives
  useEffect(() => {
    const newest = notifications[0];
    if (!newest || newest.read) return;
    if (newest.id === lastToastIdRef.current) return;
    lastToastIdRef.current = newest.id;
    setToast(newest);
  }, [notifications]);

  const handleOpenToggle = () => {
    setOpen((v) => !v);
    if (!open) markAllRead(); // clear badge when opening
  };

  return (
    <>
      {/* ── Bell button ── */}
      <div className="relative">
        <button
          id="notification-bell"
          aria-label="Notifications"
          onClick={handleOpenToggle}
          className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900
                     hover:bg-gray-100 transition-all duration-150"
        >
          {/* Bell icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388
                 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3
                 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {/* Unread count badge */}
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center
                         w-4 h-4 text-[10px] font-bold rounded-full bg-red-500 text-white
                         animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}

          {/* Live connection dot */}
          <span
            className={`absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full
              ${isConnected ? 'bg-green-400' : 'bg-gray-300'}`}
          />
        </button>

        {/* ── Dropdown ── */}
        {open && (
          <NotificationDropdown
            notifications={notifications}
            onMarkAllRead={markAllRead}
            onDismiss={dismiss}
            onClose={() => setOpen(false)}
          />
        )}
      </div>

      {/* ── Toast (fixed bottom-right) ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <NotificationToast item={toast} onDismiss={() => setToast(null)} />
        </div>
      )}
    </>
  );
}
