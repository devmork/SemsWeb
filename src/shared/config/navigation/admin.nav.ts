import { Building2, Tags, Users } from "lucide-react";
import type { NavSection } from "./types";

export const adminNav: NavSection[] = [
  {
    label: "Management",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Facilities", href: "/admin/facilities", icon: Building2 },
      {
        label: "Evaluation Types",
        href: "/admin/evaluation-types",
        icon: Tags,
      },
    ],
  },
];
