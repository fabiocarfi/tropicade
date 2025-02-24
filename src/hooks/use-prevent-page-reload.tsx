import { Canvas } from "fabric";
import { useEffect } from "react";

const usePreventPageReload = (
  canvas: Canvas | null,
  bgCanvas: Canvas | null
) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (canvas && canvas.getObjects().length === 1) {
        event.preventDefault();
        event.returnValue = "Changes may not be saved.";
      } else if (bgCanvas && bgCanvas.getObjects().length === 1) {
        event.preventDefault();
        event.returnValue = "Changes may not be saved.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [canvas, bgCanvas]);
};

export default usePreventPageReload;
