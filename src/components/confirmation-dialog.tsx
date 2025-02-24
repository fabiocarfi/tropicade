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
import { addNewConfiguration } from "@/lib/actions/configuration.actions";
import { TshirtColorsType, TshirtSizesType } from "@/types";
import { Canvas } from "fabric";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "./ui/button";

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

  const [shouldSaveDesign, setShouldSaveDesign] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data: session } = useSession();

  const generateBlob = useCallback(async () => {
    if (!canvas || !bgCanvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas?.width * 4;
    tempCanvas.height = canvas?.height * 4;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    const bgDataURL = bgCanvas?.toDataURL({
      format: "png",
      multiplier: 4,
    });
    const mainDataURL = canvas.toDataURL({
      format: "png",
      multiplier: 4,
    });

    const loadImage = (src: string) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });

    const [bgImage, mainImage] = await Promise.all([
      loadImage(bgDataURL),
      loadImage(mainDataURL),
    ]);

    tempCtx.drawImage(bgImage as HTMLImageElement, 0, 0);
    tempCtx.drawImage(mainImage as HTMLImageElement, 0, 0);

    return new Promise((resolve) => {
      tempCanvas.toBlob((blob) => {
        if (!blob) resolve(null);
        resolve(blob);
      });
    });
  }, [bgCanvas, canvas]);

  async function blobToFile(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const u8arr = new Uint8Array(arrayBuffer);
    const file = new File([u8arr], "tshirt-design.png", { type: "image/png" });
    return file;
  }

  useEffect(() => {
    (async function () {
      async function saveDesign() {
        try {
          setUploading(true);
          const blob = await generateBlob();
          const file = await blobToFile(blob as Blob);

          if (!file) return;
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("/api/files", {
            method: "POST",
            body: formData,
          });
          const imgUrl = (await response.json()) as string;

          if (imgUrl) {
            const data = {
              image: imgUrl,
              shirtSize: selectedSize.size,
              shirtColor: currentTShirtColor.label,
            };
            const res1 = await addNewConfiguration(
              data,
              session?.user?.email || ""
            );
            console.log("res 1", res1);
          }

          setUploading(false);
        } catch (error) {
          console.log(error);
          setUploading(false);
        } finally {
          setShouldSaveDesign(false);
        }
      }

      if (shouldSaveDesign && session) {
        console.log("saving design");
        await saveDesign();
        onOpenModel(false);
        router.push("/thank-you");
      } else if (shouldSaveDesign && !session) {
        onOpenModel(false);
        onAuthCardShow(true);
        // setShouldSaveDesign(false);
      }
    })();
  }, [
    session,
    shouldSaveDesign,
    router,
    onAuthCardShow,
    generateBlob,
    openModel,
    onOpenModel,
    currentTShirtColor,
    selectedSize,
  ]);

  return (
    <AlertDialog open={openModel} onOpenChange={onOpenModel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Design?</AlertDialogTitle>
          <AlertDialogDescription>
            Are your sure you want to confirm this design?
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
            onClick={() => setShouldSaveDesign(true)}
          >
            {uploading ? "Saving..." : "Yes, confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ConfirmationDialog;
