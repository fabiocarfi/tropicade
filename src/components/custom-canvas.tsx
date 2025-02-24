import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { TshirtColorsType } from "@/types";
import { RefObject } from "react";

const CustomCanvas = ({
  canvasRef,
  bgCanvasRef,
  currentTShirtColor,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  bgCanvasRef: RefObject<HTMLCanvasElement | null>;
  currentTShirtColor: TshirtColorsType;
}) => {
  return (
    <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
      <div className="w-full h-full relative z-100 flex items-center justify-center">
        <div className="absolute z-50">
          <canvas className="relative" ref={canvasRef} />
        </div>
        <div className="absolute z-10 select-none pointer-events-none">
          <canvas className="relative" ref={bgCanvasRef} />
        </div>
        <div className="w-[450px]">
          <AspectRatio ratio={408 / 596}>
            <Image
              fill
              className="w-full h-full object-contain absolute rounded-md max-w-[450px] mx-auto"
              src={currentTShirtColor.imgUrl}
              alt="Your design"
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  );
};
export default CustomCanvas;
