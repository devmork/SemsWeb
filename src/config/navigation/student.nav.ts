import { BuildingComplex, UserGroup } from "lucide-react";
import type { NavItem } from "./types";

export const studentNav: NavItem[] = [
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
];
