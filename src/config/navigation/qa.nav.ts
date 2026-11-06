import { LayoutDashboard, ClipboardCheck, FolderOpen } from "lucide-react";
import type { NavItem } from "./types";

export const qaNav: NavItem[] = [
  { label: "Dashboard", href: "/qa", icon: LayoutDashboard },
  { label: "Categories", href: "/qa/categories", icon: FolderOpen },
  { label: "Reviews", href: "/qa/reviews", icon: ClipboardCheck },
];
