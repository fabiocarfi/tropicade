"use client";

import { BACKGROUND_EFFECTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Canvas, FabricImage } from "fabric";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const CustomCarousel = ({ bgCanvas }: { bgCanvas: Canvas | null }) => {
  const [activeBgImage, setActiveBgImage] = useState(BACKGROUND_EFFECTS[0]);

  useEffect(() => {
    if (!bgCanvas) return;
    if (activeBgImage.slug === "none") {
      bgCanvas.clear();
      bgCanvas.renderAll();
    } else {
      bgCanvas.clear();
      bgCanvas.renderAll();
      const imgEl = new Image();
      imgEl.src = activeBgImage.src;

      imgEl.onload = () => {
        const imgWidth = imgEl.width;
        const imgHeight = imgEl.height;
        const canvasWidth = bgCanvas.width;
        const canvasHeight = bgCanvas.height;
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);
        const fabricImage = new FabricImage(imgEl, {
          left: bgCanvas.width! / 2,
          top: bgCanvas.height! / 2,
          scaleX: scale,
          scaleY: scale,
          originX: "center",
          originY: "center",
        });

        bgCanvas.add(fabricImage);
        bgCanvas.renderAll();
      };
    }
  }, [activeBgImage, bgCanvas]);

  return (
    <div className="w-full flex-col justify-center items-center bottom-0 max-w-[75%] md:max-w-[600px]  mx-auto flex">
      <Carousel
        opts={{
          loop: true,
          align: "center",
        }}
        className="px-4 py-4 rounded-tl-3xl rounded-tr-3xl max-w-[100%]"
      >
        <h2 className="text-lg text-muted-foreground mb-2 text-center">
          Design Color
        </h2>
        <CarouselContent>
          {BACKGROUND_EFFECTS.map((bg) => (
            <CarouselItem
              key={bg.title}
              className=" xs:basis-1/2 sm:basis-1/3 md:basis-1/5 flex flex-shrink-0 items-center justify-center py-4 "
              onClick={() => {
                setActiveBgImage(bg);
              }}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center cursor-pointer flex-col gap-1"
                )}
              >
                <NextImage
                  height={96}
                  width={96}
                  alt="bg image"
                  src={bg.src}
                  className={cn(
                    "rounded-full aspect-square object-cover border-[4px] border-solid ",
                    activeBgImage.slug === bg.slug
                      ? "w-[96px] h-[96px] border-[#B6F074]"
                      : "w-[55px] h-[55px] border-transparent"
                  )}
                />
                <span
                  className={cn(
                    "",
                    activeBgImage.slug === bg.slug
                      ? ""
                      : "text-gray-500 text-sm"
                  )}
                >
                  {bg.title}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-[#f3f4f5] w-[48px] h-[48px] flex items-center justify-center p-2" />
        <CarouselNext className="bg-[#f3f4f5] w-[48px] h-[48px] flex items-center justify-center p-2" />
      </Carousel>
    </div>
  );
};
export default CustomCarousel;
