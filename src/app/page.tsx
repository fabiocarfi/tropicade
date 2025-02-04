"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import VerticalPaddingWrapper from "@/components/VerticalPaddingWrapper";
import Layers from "./layers/Layers";

import { useRef, useState, useEffect } from "react";
import { Canvas } from "fabric";
import Image from "next/image";
import { TshirtColors, TshirtColorsType } from "../lib/tshirts-data";
import Options from "./options/Options";

interface CustomCanvas extends Canvas {
  updateZIndices?: () => void;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  const [allTShirtColors, setAllTShirtColors] = useState<
    TshirtColorsType[] | null
  >([]);

  const [currentTShirtColor, setCurrentTShirtColor] =
    useState<TshirtColorsType>(TshirtColors[0]);

  useEffect(() => {
    setAllTShirtColors(TshirtColors);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas: CustomCanvas = new Canvas(canvasRef.current, {
        width: 330,
        height: 370,
        backgroundColor: "transparent",
      });

      initCanvas.renderAll();
      setCanvas(initCanvas);

      const resizeCanvas = () => {
        const screenWidth = window.innerWidth;
        const maxWidth = 330;
        const maxHeight = 370;
        const aspectRatio = maxHeight / maxWidth;

        const newWidth = Math.ceil(Math.min(screenWidth * 0.175, maxWidth));
        const newHeight = Math.ceil(newWidth * aspectRatio);
        console.log(newWidth, newHeight);

        canvas?.setDimensions({ width: newWidth, height: newHeight });
        document.querySelectorAll("canvas")!.forEach((canvas) => {
          canvas.style.width = `${newWidth}px`;
          canvas.style.height = `${newHeight}px`;
        });

        const canvasWrapperDiv = document.querySelector<HTMLDivElement>(
          '[data-fabric="wrapper"]'
        );
        canvasWrapperDiv!.style.width = `${newWidth}px`;
        canvasWrapperDiv!.style.height = `${newHeight}px`;
      };

      window.addEventListener("resize", resizeCanvas);

      return () => {
        initCanvas.dispose();
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [canvas]);

  return (
    <section>
      <MaxWidthWrapper>
        <VerticalPaddingWrapper>
          <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_4fr_3fr] gap-4 md:gap-8 min-h-[auto] xl:min-h-[650px]">
            <Layers canvas={canvas} />

            <div className="relative overflow-hidden w-full h-full flex items-center justify-center min-h-[300px] sm:min-h-[450px] md:min-h-[650px] xl:min-h-[auto]">
              <canvas className="relative z-40 ]" ref={canvasRef} />
              <Image
                width={606}
                height={606}
                className="w-full h-full object-contain absolute rounded-md"
                src={currentTShirtColor.imgUrl}
                alt="Your design"
              />
            </div>
            <Options
              allTShirtColors={allTShirtColors}
              currentTShirtColor={currentTShirtColor}
              setCurrentTShirtColor={setCurrentTShirtColor}
            />
          </div>
        </VerticalPaddingWrapper>
      </MaxWidthWrapper>
    </section>
  );
}
