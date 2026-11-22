import { BarChart3, Calendar, FolderOpen, LayoutTemplate } from "lucide-react";
import type { NavSection } from "./types";

export const qaNav: NavSection[] = [
  {
    label: "Dashboard",
    items: [
      { label: "Categories", href: "/qa/categories", icon: FolderOpen },
      { label: "Forms", href: "/qa/forms", icon: LayoutTemplate },
      { label: "Sessions", href: "/qa/sessions", icon: Calendar },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Facility Results",
        href: "/qa/reports/facility",
        icon: BarChart3,
      },
    ],
  },
];
