"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, LogOut } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import NotificationBell to avoid SSR issues with socket.io-client
const NotificationBell = dynamic(() => import("@/components/NotificationBell"), {
  ssr: false,
});

type BrandHeaderProps = {
  subtitle?: string;
};

/**
 * BrandHeader
 *
 * Top navigation bar shown on all authenticated pages.
 * Includes: logo, optional subtitle, notification bell, and logout button.
 */
export default function BrandHeader({ subtitle }: BrandHeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* ── Logo + title ── */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">UNI</h1>
              <p className="text-sm text-gray-500">Connect. Study. Grow.</p>
            </div>
          </div>

          {/* ── Right actions: bell + logout ── */}
          <div className="flex items-center gap-2">
            {/* Notification Bell — lazy-loaded, client-only */}
            <NotificationBell />

            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {subtitle && (
          <div className="mt-2 text-sm text-gray-600">
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    </header>
  );
}