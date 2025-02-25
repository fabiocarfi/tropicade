// hooks/useSaveDesign.ts
import { Canvas } from "fabric";
import { useState, useCallback } from "react";
import { addNewConfiguration } from "@/lib/actions/configuration.actions";
import { TshirtColorsType, TshirtSizesType } from "@/types";
import { Session } from "next-auth";

export function useSaveDesign() {
  const [uploading, setUploading] = useState(false);

  const generateBlob = useCallback(
    async (canvas: Canvas | null, bgCanvas: Canvas | null) => {
      if (!canvas || !bgCanvas) return null;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas?.width * 4;
      tempCanvas.height = canvas?.height * 4;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return null;

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

      try {
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
      } catch (error) {
        console.error("Error generating design blob:", error);
        return null;
      }
    },
    []
  );

  async function blobToFile(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const u8arr = new Uint8Array(arrayBuffer);
    const file = new File([u8arr], "tshirt-design.png", { type: "image/png" });
    return file;
  }

  const saveDesign = async (
    canvas: Canvas | null,
    bgCanvas: Canvas | null,
    session: Session | null,
    tshirtColor: TshirtColorsType,
    tshirtSize: TshirtSizesType
  ) => {
    try {
      setUploading(true);
      const blob = await generateBlob(canvas, bgCanvas);

      if (!blob) {
        setUploading(false);
        return { success: false, reason: "blob-generation-failed" };
      }

      const file = await blobToFile(blob as Blob);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`File upload failed: ${response.status}`);
      }

      const imgUrl = (await response.json()) as string;

      if (imgUrl) {
        const data = {
          image: imgUrl,
          shirtSize: tshirtSize.size,
          shirtColor: tshirtColor.label,
        };

        const res = await addNewConfiguration(data, session?.user?.email || "");

        if (res.success) {
          return { success: true, configId: res.configId || null };
        }
        return { success: false };
      }
    } catch (error) {
      console.error("Error saving design:", error);
      return { success: false, reason: "save-failed", error };
    } finally {
      setUploading(false);
    }
  };

  return { saveDesign, uploading };
}
