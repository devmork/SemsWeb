import { Building2, Users } from "lucide-react";
import type { NavItem } from "./types";

export const adminNav: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Facilities", href: "/admin/facilities", icon: Building2 },
];
