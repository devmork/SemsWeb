// src/features/student/components/MyProfile.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RefreshCw, User, Mail } from "lucide-react";
import MyProfileSkeleton from "./MyProfileSkeleton";
import { useAuthStore } from "@/stores/auth.store";

export default function MyProfile() {
  const user = useAuthStore((s) => s.user);
  const profile = user?.studentProfile;

  if (!user || !profile) {
    return <MyProfileSkeleton />;
  }

  const initials = `${user.name.charAt(0)}`.toUpperCase();
  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <div className="flex flex-col gap-6 w-full py-6">
      {/* 1. Greeting Header */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 shadow-sm border-hairline">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Hi, {firstName.toUpperCase()}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's your student academic profile in SEMS.
          </p>
        </div>
        <Button variant="outline" className="mt-4 sm:mt-0 gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync Registrar
        </Button>
      </Card>

      {/* 2. Profile Main Card */}
      <Card className="p-6 shadow-sm border-hairline">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-24 w-24 rounded-2xl">
            {user.pictureUrl && (
              <AvatarImage
                src={user.pictureUrl}
                alt={user.name}
                className="rounded-2xl"
              />
            )}
            <AvatarFallback className="rounded-2xl bg-blue-100 text-blue-700 text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              ID: {profile.schoolStudentId}
            </span>
            <h2 className="text-3xl font-bold tracking-tight uppercase">
              {user.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center rounded-md border border-hairline px-2 py-1 text-xs font-medium text-muted-foreground">
                ID: {profile.schoolStudentId}
              </span>
              <span className="inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                {profile.program ?? "N/A"} — {profile.yearLevel ?? "N/A"}
              </span>
              <span className="inline-flex items-center rounded-md border border-hairline px-2 py-1 text-xs font-medium text-muted-foreground">
                {profile.academicYear ?? "N/A"} · {profile.semester ?? "N/A"} ·{" "}
                {profile.enrollmentStatus ?? "N/A"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card className="shadow-sm border-hairline overflow-hidden">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
              <User className="h-4 w-4" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">
                  First Name
                </p>
                <p className="text-sm font-bold mt-1">
                  {user.name.split(" ")[0]}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">
                  Last Name
                </p>
                <p className="text-sm font-bold mt-1">
                  {user.name.split(" ").slice(1).join(" ")}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">
                  Suffix
                </p>
                <p className="text-sm font-bold mt-1">
                  {profile.suffix || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="shadow-sm border-hairline overflow-hidden">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
              <Mail className="h-4 w-4" /> Contact & Identification
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-medium text-muted-foreground uppercase">
                Email Address
              </p>
              <p className="text-sm font-bold mt-1">{user.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
