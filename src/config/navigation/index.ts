import { adminNav } from "./admin.nav";
import { qaNav } from "./qa.nav";
import { studentNav } from "./student.nav";
import type { NavConfig } from "./types";

export const navConfig: NavConfig = {
  admin: adminNav,
  qa: qaNav,
  student: studentNav,
};

export type { NavItem, NavConfig } from "./types";
