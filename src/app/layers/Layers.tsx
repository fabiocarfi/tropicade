"use client";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  FabricImage,
  Canvas,
  FabricObject,
  TEvent,
  TPointerEvent,
} from "fabric";
import { ArrowDown, ArrowUp } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface CustomCanvas extends Canvas {
  updateZIndices?: () => void;
}

type LayerProps = {
  canvas: CustomCanvas | null;
};

type Layer = {
  id?: string;
  zIndex?: number;
  type?: string | undefined;
  thumbnailUrl?: string;
};

interface CustomFabricObject extends FabricObject {
  id?: string;
  zIndex?: number;
  imgUrl?: string;
}

class FabricImageWithImgUrl extends FabricImage {
  imgUrl?: string;
}

const Layers = ({ canvas }: LayerProps) => {
  const [accordianOpen, setAccordianOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file && canvas) {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        if (e.target?.result) {
          const imgEl = new Image();
          imgEl.src = e.target?.result as string;
          imgEl.onload = function () {
            // image is read;
            const imgWidth = imgEl.width;
            const imgHeight = imgEl.height;

            const maxWidth = canvas.width * 0.5;
            const maxHeight = canvas.height * 0.5;

            const scale = Math.min(
              maxWidth / imgWidth,
              maxHeight / imgHeight,
              1
            );

            const fabricImage = new FabricImageWithImgUrl(imgEl, {
              left: canvas.width / 2,
              top: canvas.height / 2,
              scaleX: scale,
              scaleY: scale,
              originX: "center",
              originY: "center",
            });

            fabricImage.imgUrl = imgEl.src;
            canvas.add(fabricImage);
            canvas.renderAll();
          };
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  // add id to objects
  const addIdToObject = (object: CustomFabricObject) => {
    if (!object.id) {
      const timeStamp = new Date().getTime();
      object.id = `${object.type}_${timeStamp}`;
    }
  };

  //move selected layer
  const moveSelectedLayer = (direction: "up" | "down") => {
    if (!selectedLayer) return;

    const objects: CustomFabricObject[] | undefined = canvas?.getObjects();
    const object = objects?.find((obj) => obj.id === selectedLayer);

    if (objects && object) {
      const currentIndex = objects?.indexOf(object);
      if (direction === "up" && currentIndex < objects.length - 1) {
        const temp = objects[currentIndex];
        objects[currentIndex] = objects[currentIndex + 1];
        objects[currentIndex + 1] = temp;
      }

      if (direction === "down" && currentIndex > 0) {
        const temp = objects[currentIndex];
        objects[currentIndex] = objects[currentIndex - 1];
        objects[currentIndex - 1] = temp;
      }
    }

    const bgColor = canvas?.backgroundColor;
    canvas?.clear();
    objects?.forEach((obj) => canvas?.add(obj));
    canvas?.set({
      backgroundColor: bgColor,
    });

    canvas?.renderAll();

    objects?.forEach((obj, index) => {
      obj.zIndex = index;
    });

    canvas?.setActiveObject(object as CustomFabricObject);
    canvas?.renderAll();
    handleLayerUpdate();
  };

  // modify zindex to layers

  (Canvas.prototype as CustomCanvas).updateZIndices = function () {
    const objects: CustomFabricObject[] = this.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj);
      obj.zIndex = index;
    });
  };

  const handleLayerUpdate = useCallback(() => {
    if (canvas) {
      canvas.updateZIndices!();

      const objects = (canvas.getObjects() as CustomFabricObject[])
        .filter(
          (obj) =>
            !(
              obj.id!.startsWith("vertical-") ||
              obj.id!.startsWith("horizontal-")
            )
        )
        .map((obj) => ({
          id: obj.id,
          zIndex: obj.zIndex,
          type: obj.type,
          thumbnailUrl: obj.imgUrl,
        }));

      setLayers([...objects].reverse());
    }
  }, [canvas]);

  const handleObjectSelection = (
    e: Partial<TEvent<TPointerEvent>> & {
      selected: CustomFabricObject[];
    }
  ) => {
    const selectedObject = e.selected ? e.selected[0] : null;
    if (selectedObject) {
      setSelectedLayer(selectedObject.id!);
    } else {
      setSelectedLayer(null);
    }
  };

  const onLayerSelect = (layerId: string) => {
    const obj = (canvas?.getObjects() as CustomFabricObject[]).find(
      (obj) => obj.id === layerId
    );
    if (obj) {
      canvas?.setActiveObject(obj);
      canvas?.renderAll();
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", handleLayerUpdate);
      canvas.on("object:modified", handleLayerUpdate);
      canvas.on("object:removed", handleLayerUpdate);

      canvas.on("selection:created", handleObjectSelection);
      canvas.on("selection:updated", handleObjectSelection);
      canvas.on("selection:cleared", () => setSelectedLayer(null));
      return () => {
        canvas.off("object:added", handleLayerUpdate);
        canvas.off("object:modified", handleLayerUpdate);
        canvas.off("object:removed", handleLayerUpdate);

        canvas.on("selection:created", handleObjectSelection);
        canvas.on("selection:updated", handleObjectSelection);
        canvas.on("selection:cleared", () => setSelectedLayer(null));
      };
    }
  }, [canvas, handleLayerUpdate]);

  return (
    <div className="">
      <Accordion type="single" collapsible className="" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger onClick={() => setAccordianOpen((prev) => !prev)}>
            <div className="flex items-top justify-between w-full">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  T-Shirt
                </h2>
                <span className="text-gray-400 text-lg font-medium">
                  Design #001
                </span>
              </div>
              <div
                className={cn(
                  "w-12 h-12 shrink-0 flex-grow-0 rounded-full bg-white flex items-center justify-center duration-200",
                  accordianOpen ? "rotate-180" : "rotate-0"
                )}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.8335 7.66675L10.0002 13.5001L4.16683 7.66675"
                    stroke="#111317"
                    strokeOpacity="0.55"
                    strokeWidth="2.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-2 align-center justify-end">
              <Button
                disabled={!selectedLayer || layers[0].id === selectedLayer}
                onClick={() => moveSelectedLayer("up")}
              >
                <ArrowUp />
              </Button>
              <Button
                disabled={
                  !selectedLayer ||
                  layers[layers.length - 1].id === selectedLayer
                }
                onClick={() => moveSelectedLayer("down")}
              >
                <ArrowDown />
              </Button>
            </div>
            <div className="mt-4 md:mt-8">
              <div className="flex flex-col gap-4">
                {layers &&
                  layers.map((layer) => (
                    <div
                      key={layer.id}
                      onClick={() => onLayerSelect(layer.id!)}
                      className="flex gap-4 items-center cursor-pointer bg-white/25 hover:bg-white/50 p-2 rounded-md"
                    >
                      <div
                        style={{
                          backgroundColor:
                            layer.id === selectedLayer ? "#fff" : "transparent",
                        }}
                        className="w-24 h-24 rounded-full border-solid border-2 border-borderBlack flex items-center justify-center "
                      >
                        <NextImage
                          width={60}
                          height={60}
                          src={layer.thumbnailUrl!}
                          alt="Layer image"
                          className="max-h-[60px] max-w-[60px] object-contain"
                        />
                      </div>
                      <span className="opacity-75 md:font-[18px]">
                        {layer.type} {layer.zIndex}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="mt-10">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="py-4 w-full bg-[#111317] color-white text-[17px] text-white rounded-full px-8 min-h-[61px] max-w[325px]"
                >
                  Upload Picture
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {/* <Upload /> */}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Layers;
