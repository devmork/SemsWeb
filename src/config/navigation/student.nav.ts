import { ClipboardList, LayoutDashboard, UserCircle } from "lucide-react";
import type { NavItem } from "./types";

export const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  {
    label: "My Evaluations",
    href: "/student/evaluations",
    icon: ClipboardList,
  },
  { label: "My Profile", href: "/student/profile", icon: UserCircle },
];
