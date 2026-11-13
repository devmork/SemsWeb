import { MyProfile } from "@/features/profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/profile")({
  component: MyProfile,
});
