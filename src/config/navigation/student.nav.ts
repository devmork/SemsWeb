import { ClipboardList, UserCircle } from "lucide-react";
import type { NavItem } from "./types";

export const studentNav: NavItem[] = [
  { label: "My Profile", href: "/student/profile", icon: UserCircle },
  {
    label: "Guidance",
    href: "/student/guidance-evaluations",
    icon: ClipboardList,
  },
  {
    label: "Teacher",
    href: "/student/teacher-evaluations",
    icon: ClipboardList,
  },
  {
    label: "Clinic",
    href: "/student/clinic-evaluations",
    icon: ClipboardList,
  },
  {
    label: "Library",
    href: "/student/library-evaluations",
    icon: ClipboardList,
  },
];
