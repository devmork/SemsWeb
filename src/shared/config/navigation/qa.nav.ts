import {
  BarChart3,
  Building2,
  Calendar,
  FolderOpen,
  LayoutTemplate,
  Tags,
} from "lucide-react";
import type { NavSection } from "./types";

export const qaNav: NavSection[] = [
  {
    label: "Dashboard",
    items: [
      { label: "Categories", href: "/qa/categories", icon: FolderOpen },
      {
        label: "Evaluation Types",
        href: "/qa/evaluation-types",
        icon: Tags,
      },
      { label: "Forms", href: "/qa/forms", icon: LayoutTemplate },
      { label: "Sessions", href: "/qa/sessions", icon: Calendar },
      { label: "Facilities", href: "/qa/facilities", icon: Building2 },
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
