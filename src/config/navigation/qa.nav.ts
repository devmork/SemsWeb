import { FolderOpen, LayoutTemplate } from "lucide-react";
import type { NavItem } from "./types";

export const qaNav: NavItem[] = [
  { label: "Categories", href: "/qa/categories", icon: FolderOpen },
  { label: "Forms", href: "/qa/forms", icon: LayoutTemplate },
];
