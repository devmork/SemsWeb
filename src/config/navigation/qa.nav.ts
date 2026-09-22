import { LayoutDashboard, ClipboardCheck } from "lucide-react";
import type { NavItem } from "./types";

export const qaNav: NavItem[] = [
  { label: "Dashboard", href: "/qa", icon: LayoutDashboard },
  { label: "Reviews", href: "/qa/reviews", icon: ClipboardCheck },
];
