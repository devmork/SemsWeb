import { BarChart3, Calendar, LayoutTemplate } from "lucide-react";
import type { NavSection } from "./types";

export const qaNav: NavSection[] = [
  {
    label: "Dashboard",
    items: [
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
