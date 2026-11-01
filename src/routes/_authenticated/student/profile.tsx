import MyProfile from "@/features/student/components/MyProfile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/profile")({
  component: MyProfile,
});
