"use client";
import { useEffect } from "react";
import { DesktopSidebar } from "./sidebar";
import { Header } from "./header";
import { AICopilot } from "./ai-copilot";
import { Toaster } from "@/components/ui/toaster";
import { PortalKey } from "@/lib/nav-config";
import { Crumb, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { hydrateFromApi } from "@/lib/data/hydrate";

export function PortalShell({
  portal,
  userName,
  userColor,
  userRole,
  breadcrumbs,
  children,
}: {
  portal: PortalKey;
  userName: string;
  userColor: string;
  userRole: string;
  breadcrumbs?: Crumb[];
  children: React.ReactNode;
}) {
  // Pulls live data from the SkillDex API (Railway) when NEXT_PUBLIC_API_URL is
  // configured, swapping it into the local seed arrays in place. No-ops (and
  // keeps local seed data) if the env var is unset or the backend is unreachable.
  useEffect(() => {
    hydrateFromApi();
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <DesktopSidebar portal={portal} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header portal={portal} userName={userName} userColor={userColor} userRole={userRole} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
            {breadcrumbs && (
              <div className="mb-4">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
      <AICopilot portal={portal} />
      <Toaster />
    </div>
  );
}
