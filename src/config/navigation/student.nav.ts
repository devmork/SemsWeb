import { ClipboardList, UserCircle } from "lucide-react";
import type { NavItem } from "./types";

export const studentNav: NavItem[] = [
  { label: "My Profile", href: "/student/profile", icon: UserCircle },
  {
    label: "Guidance",
    href: "/student/guidance",
    icon: ClipboardList,
  },
  {
    label: "Teacher",
    href: "/student/teacher",
    icon: ClipboardList,
  },
];
