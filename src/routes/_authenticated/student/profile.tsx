import MyProfile from "@/features/academic-profile/components/MyProfile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/profile")({
  component: MyProfile,
});
