import { Outlet } from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./AppSidebar";
import { useEffect, useState, type ReactNode } from "react";
import { BootLoader } from "./BootLoader";
import type { NavigationItem } from "@/shared/config/navigation/types";

interface AppLayoutProps {
  navItems: NavigationItem[];
  sidebarFooter?: ReactNode;
}

export function AppLayout({ navItems, sidebarFooter }: AppLayoutProps) {
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // Stall for 2.5 seconds while the animation plays out
    // In production, tie this to your `useQuery` loading state
    const timer = setTimeout(() => {
      setIsSyncing(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // If still syncing, show the loading screen
  if (isSyncing) {
    return <BootLoader />;
  }
  return (
    <SidebarProvider>
      <AppSidebar items={navItems} footer={sidebarFooter} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
