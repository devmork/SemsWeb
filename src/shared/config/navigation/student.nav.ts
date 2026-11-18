import { BuildingComplex, UserGroup } from "lucide-react";
import type { NavSection } from "./types";

export const studentNav: NavSection[] = [
  {
    label: "Dashboard",
    items: [
      {
        label: "Teachers",
        href: "/student/teachers",
        icon: UserGroup,
      },
      {
        label: "Facilities",
        href: "/student/facilities",
        icon: BuildingComplex,
      },
    ],
  },
];
