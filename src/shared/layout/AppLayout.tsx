import { Outlet } from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./AppSidebar";
import { type ReactNode } from "react";
// import { BootLoader } from "./BootLoader";
import { AnimateUIProvider } from "@animate-ui/react/provider";
import type { NavigationSection } from "@/shared/config/navigation/types";

interface AppLayoutProps {
  navSections: NavigationSection[];
  sidebarFooter?: ReactNode;
}

export function AppLayout({ navSections, sidebarFooter }: AppLayoutProps) {
  // const [isSyncing, setIsSyncing] = useState(true);

  // useEffect(() => {
  //   // Stall for 2.5 seconds while the animation plays out
  //   // In production, tie this to your `useQuery` loading state
  //   const timer = setTimeout(() => {
  //     setIsSyncing(false);
  //   }, 8000);

  //   return () => clearTimeout(timer);
  // }, []);

  // If still syncing, show the loading screen
  // if (isSyncing) {
  //   return <BootLoader />;
  // }
  return (
    <AnimateUIProvider>
      <SidebarProvider>
        <AppSidebar sections={navSections} footer={sidebarFooter} />
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
    </AnimateUIProvider>
  );
}
