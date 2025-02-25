// ConfirmationDialog.tsx
"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TshirtColorsType, TshirtSizesType } from "@/types";
import { Canvas } from "fabric";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { useSaveDesign } from "@/hooks/use-save-design";
import { setConfigId } from "@/lib/actions/configuration.actions";
import { Loader } from "lucide-react";

const ConfirmationDialog = ({
  openModel,
  onOpenModel,
  onAuthCardShow,
  currentTShirtColor,
  selectedSize,
  canvas,
  bgCanvas,
}: {
  openModel: boolean;
  onOpenModel: (value: SetStateAction<boolean>) => void;
  onAuthCardShow: Dispatch<SetStateAction<boolean>>;
  currentTShirtColor: TshirtColorsType;
  selectedSize: TshirtSizesType;
  canvas: Canvas | null;
  bgCanvas: Canvas | null;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { saveDesign, uploading } = useSaveDesign();

  const handleConfirm = async () => {
    const res = await saveDesign(
      canvas,
      bgCanvas,
      session,
      currentTShirtColor,
      selectedSize
    );

    if (res) {
      if (session) {
        onOpenModel(false);
        router.push("/thank-you");
        return;
      } else {
        if (res.configId) setConfigId(res.configId);
        onOpenModel(false);
        onAuthCardShow(true);
      }
    }
  };

  return (
    <AlertDialog open={openModel} onOpenChange={onOpenModel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Design?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to confirm this design?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              disabled={uploading}
              variant={"outline"}
              onClick={() => onOpenModel(false)}
            >
              Keep Editing
            </Button>
          </AlertDialogCancel>

          <Button
            disabled={uploading}
            variant={"default"}
            onClick={handleConfirm}
          >
            {uploading ? "Saving..." : "Yes, confirm"}{" "}
            {uploading && <Loader className="animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
