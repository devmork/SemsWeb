import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MyProfile } from "./MyProfile";

interface ProfileSettingsDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MyProfileDialog({
  children,
  open,
  onOpenChange,
}: ProfileSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* The trigger is what opens the dialog. We'll customize this in the footer. */}
      {children && <DialogTrigger render={children as React.ReactElement} />}

      <DialogContent className="max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and academic profile.
          </DialogDescription>
        </DialogHeader>

        {/* 
          This is where we embed the MyProfile component. 
          We add px-6 pb-6 to match the Dialog padding.
        */}
        <div className="px-6 pb-6">
          <MyProfile />
        </div>
      </DialogContent>
    </Dialog>
  );
}
