import { Building2, FolderOpen, Tags, Users } from "lucide-react";
import type { NavSection } from "./types";

export const adminNav: NavSection[] = [
  {
    label: "Management",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderOpen,
      },
      {
        label: "Evaluation Types",
        href: "/admin/evaluation-types",
        icon: Tags,
      },
      { label: "Facilities", href: "/admin/facilities", icon: Building2 },
    ],
  },
];
