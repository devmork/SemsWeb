import { Users } from "lucide-react";
import type { NavSection } from "./types";

export const adminNav: NavSection[] = [
  {
    label: "Management",
    items: [{ label: "Users", href: "/admin/users", icon: Users }],
  },
];
