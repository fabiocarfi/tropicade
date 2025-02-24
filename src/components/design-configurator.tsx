"use client";

import usePreventPageReload from "@/hooks/use-prevent-page-reload";
import { TSHIRT_COLORS, TSHIRT_SIZES } from "@/lib/constants";
import { TshirtColorsType } from "@/types";
import { Canvas } from "fabric";
import { useEffect, useRef, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import VerticalPaddingWrapper from "./VerticalPaddingWrapper";
import AuthDialog from "./auth-dialog";
import ConfirmationDialog from "./confirmation-dialog";
import CustomCanvas from "./custom-canvas";
import CustomCarousel from "./custom-carousel";
import DesignLayers from "./design-layers";
import DesignOptions from "./design-options";
import Navbar from "./header/navbar";

interface CustomCanvas extends Canvas {
  updateZIndices?: () => void;
}

export default function DesignConfigurator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [bgCanvas, setBgCanvase] = useState<Canvas | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const [allTShirtColors, setAllTShirtColors] = useState<
    TshirtColorsType[] | null
  >([]);

  const [currentTShirtColor, setCurrentTShirtColor] =
    useState<TshirtColorsType>(TSHIRT_COLORS[0]);

  const [selectedSize, setSelectedSize] = useState(TSHIRT_SIZES[3]);

  useEffect(() => {
    setAllTShirtColors(TSHIRT_COLORS);
  }, []);

  useEffect(() => {
    if (canvasRef.current && bgCanvasRef.current) {
      const initCanvas: CustomCanvas = new Canvas(canvasRef.current, {
        width: 330,
        height: 370,
        backgroundColor: "transparent",
      });

      const bgInitCanvas: CustomCanvas = new Canvas(bgCanvasRef.current, {
        width: 330,
        height: 370,
        backgroundColor: "transparent",
      });

      initCanvas.renderAll();
      bgInitCanvas.renderAll();
      setCanvas(initCanvas);
      setBgCanvase(bgInitCanvas);

      return () => {
        initCanvas.dispose();
        bgInitCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      if (!canvas || !bgCanvas) return;
      const maxWidth = 300;
      const maxHeight = 340;

      const aspectRatio = maxHeight / maxWidth;
      let newWidth = maxWidth;
      let newHeight = maxHeight;

      if (window.innerWidth < 480 && window.innerWidth > 400) newWidth = 230;
      if (window.innerWidth < 400 && window.innerWidth > 360) newWidth = 210;
      if (window.innerWidth < 360) newWidth = 200;

      newHeight = aspectRatio * newWidth;

      canvas?.setDimensions({ width: newWidth, height: newHeight });
      document.querySelectorAll("canvas")!.forEach((canvas) => {
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
      });
      bgCanvas?.setDimensions({ width: newWidth, height: newHeight });
      document.querySelectorAll("canvas")!.forEach((canvas) => {
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
      });

      const canvasWrapperDivs = document.querySelectorAll<HTMLDivElement>(
        '[data-fabric="wrapper"]'
      );

      canvasWrapperDivs.forEach((canvasWrapperDiv) => {
        canvasWrapperDiv!.style.width = `${newWidth}px`;
        canvasWrapperDiv!.style.height = `${newHeight}px`;
      });
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvas, bgCanvas]);

  usePreventPageReload(canvas, bgCanvas);

  return (
    <>
      <MaxWidthWrapper>
        <Navbar
          openModel={showConfirmationDialog}
          onOpenModel={(state) => setShowConfirmationDialog(state)}
        />
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <VerticalPaddingWrapper>
          <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_4fr_2.5fr] gap-4 md:gap-8 min-h-[auto] xl:min-h-[650px]">
            <DesignLayers canvas={canvas} />
            <CustomCanvas
              canvasRef={canvasRef}
              bgCanvasRef={bgCanvasRef}
              currentTShirtColor={currentTShirtColor}
            />
            <DesignOptions
              allTShirtColors={allTShirtColors}
              currentTShirtColor={currentTShirtColor}
              setCurrentTShirtColor={setCurrentTShirtColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              TshirtSizes={TSHIRT_SIZES}
              canvas={canvas}
              onOpenModel={() => setShowConfirmationDialog(true)}
            />
          </div>
          <CustomCarousel bgCanvas={bgCanvas} />
          <ConfirmationDialog
            openModel={showConfirmationDialog}
            onOpenModel={(state) => setShowConfirmationDialog(state)}
            onAuthCardShow={setShowAuthDialog}
            canvas={canvas}
            bgCanvas={bgCanvas}
            currentTShirtColor={currentTShirtColor}
            selectedSize={selectedSize}
          />
          <AuthDialog
            showAuthDialog={showAuthDialog}
            setShowAuthDialog={(state) => setShowAuthDialog(state)}
          />
        </VerticalPaddingWrapper>
      </MaxWidthWrapper>
    </>
  );
}
