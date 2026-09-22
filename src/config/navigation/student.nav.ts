import { LayoutDashboard, UserCircle } from "lucide-react";
import type { NavItem } from "./types";

export const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "Profile", href: "/student/profile", icon: UserCircle },
];
