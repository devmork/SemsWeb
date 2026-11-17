export { UserManagement } from "./components/UserManagement";
export { UserRoleTable } from "./components/UserRoleTable";
export { RoleBadge } from "./components/RoleBadge";

export { useUsers, usersQueryKey } from "./hooks/useUsers";
export { useUpdateUserRoles } from "./hooks/useUpdateUserRole";

export { userService } from "./services/userService";
export type { GetUsersParams } from "./services/userService";

export type { ManagedUser, UpdateUserRolesInput } from "./types";
export { fullNameOf, initialsOf } from "./types";
