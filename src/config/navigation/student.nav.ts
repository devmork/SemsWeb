import { ClipboardList } from "lucide-react";
import type { NavItem } from "./types";

export const studentNav: NavItem[] = [
  {
    label: "Teacher",
    href: "/student/teacher",
    icon: ClipboardList,
  },
  {
    label: "Guidance",
    href: "/student/guidance",
    icon: ClipboardList,
  },
  {
    label: "Clinic",
    href: "/student/clinic",
    icon: ClipboardList,
  },
  {
    label: "Library",
    href: "/student/library",
    icon: ClipboardList,
  },
];
