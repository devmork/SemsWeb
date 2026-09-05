import {
  LayoutDashboard,
  Users,
  Settings,
  ClipboardCheck,
  UserCircle,
} from "lucide-react";
import type { NavConfig } from "@/types/nav.types";

export const navConfig: NavConfig = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  qa: [
    { label: "Dashboard", href: "/qa", icon: LayoutDashboard },
    { label: "Reviews", href: "/qa/reviews", icon: ClipboardCheck },
  ],
  student: [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "Profile", href: "/student/profile", icon: UserCircle },
  ],
};
