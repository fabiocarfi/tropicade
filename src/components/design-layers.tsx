"use client";
import { Canvas, TEvent, TPointerEvent } from "fabric";
import { ArrowDown, ArrowUp, Loader2, MoreVertical, Trash } from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  CustomCanvas,
  CustomFabricObject,
  FabricImageWithImgUrl,
  Layer,
} from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type LayerProps = {
  canvas: CustomCanvas | null;
};

const DesignLayers = ({ canvas }: LayerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = e.target?.files?.[0];
    if (!file || !canvas) return;

    const fileReader = new FileReader();

    fileReader.onload = async function (e) {
      if (!e.target?.result) return;

      try {
        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": "oYXLNexhdwHpDUTQnjSdsuDe",
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to remove background");

        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        const imgEl = new Image();
        imgEl.src = objectURL;

        // when not using the api
        // const imgEl = new Image();
        // imgEl.src = e.target?.result as string;

        imgEl.onload = function () {
          const imgWidth = imgEl.width;
          const imgHeight = imgEl.height;
          const maxWidth = canvas.width * 0.5;
          const maxHeight = canvas.height * 0.5;
          const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

          const fabricImage = new FabricImageWithImgUrl(imgEl, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            scaleX: scale,
            scaleY: scale,
            originX: "center",
            originY: "center",
            cornerColor: "#B6F074",
            borderColor: "#B6F074",
            cornerStyle: "circle",
            cornerStrokeColor: "#B6F074",
            transparentCorners: false,
          });

          fabricImage.imgUrl = imgEl.src;
          canvas.add(fabricImage);
          canvas.renderAll();
        };
      } catch (error) {
        console.error("Error processing image:", error);
      }
      setIsUploading(false);
    };

    fileReader.readAsDataURL(file);
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
      obj.zIndex = obj.type === "text" ? 9999 + index : index;
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
              obj.id!.startsWith("horizontal-") ||
              obj.id!.startsWith("text_")
            )
        )
        .map((obj) => ({
          id: obj.id,
          zIndex: obj.zIndex,
          type: obj.type,
          thumbnailUrl:
            obj.type === "image" ? obj.imgUrl : "/placeholder-text.svg",
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

        canvas.off("selection:created", handleObjectSelection);
        canvas.off("selection:updated", handleObjectSelection);
        canvas.off("selection:cleared", () => setSelectedLayer(null));
      };
    }
  }, [canvas, handleLayerUpdate]);

  //clear selection
  useEffect(() => {
    if (!canvas) return;
    const handleClickOutside = (e: MouseEvent) => {
      const activeObj = canvas.getActiveObjects();
      if (!activeObj) return;
      const clickedEl = e.target as HTMLElement;
      const isCanvasClick = clickedEl.closest("canvas");
      const isLayerClick = clickedEl.closest(".layer-item");
      if (!isLayerClick && !isCanvasClick) {
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [canvas]);

  return (
    <div className="flex justify-center w-full flex-col h-full">
      {layers && layers.length > 0 && (
        <div className="bg-white w-full p-6 pb-12 rounded-[40px]">
          <div className="flex flex-col gap-4">
            {layers.map((layer) => (
              <div
                key={layer.id}
                onPointerDownCapture={() => onLayerSelect(layer.id!)}
                className={cn(
                  "layer-item flex gap-4 items-center justify-between cursor-pointer p-2 bg-[#F4F4F4] rounded-[100px] border-[2px] border-solid border-transparent",
                  layer.id === selectedLayer ? " border-[#B6F074]" : ""
                )}
              >
                <div className="flex gap-2 items-center ">
                  <div className="w-[52px] h-[52px] rounded-full border-solid flex items-center justify-center bg-white">
                    <NextImage
                      width={32}
                      height={32}
                      src={layer.thumbnailUrl!}
                      alt="Layer image"
                      className="max-h-[30px] max-w-[30px] object-contain"
                    />
                  </div>
                  <span className="">
                    {layer.type} {layer.zIndex}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="w-[52px] h-[52px] flex items-center justify-center bg-[#E3E3E3] rounded-full">
                      <MoreVertical />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                      disabled={
                        !selectedLayer || layers[0].id === selectedLayer
                      }
                      onClick={() => moveSelectedLayer("up")}
                    >
                      Move Up <ArrowUp />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                      disabled={
                        !selectedLayer ||
                        layers[layers.length - 1].id === selectedLayer
                      }
                      onClick={() => moveSelectedLayer("down")}
                    >
                      Move Down <ArrowDown />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        canvas?.remove(
                          canvas?.getActiveObject() as CustomFabricObject
                        );
                        canvas?.renderAll();
                      }}
                      className="hover:bg-gray-100 cursor-pointer text-red-500 hover:text-red-500 focus:text-red-500"
                    >
                      Delete <Trash />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[90%] mx-auto w-full">
        <button
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className=" w-full bg-[#B6F074]  rounded-[100px] px-3 py-2 min-h-[61px] flex justify-between items-center -translate-y-[50%] disabled:opacity-50 disabled:pointer-events-none"
        >
          <NextImage
            src={"/add-icon.svg"}
            alt="Add Image"
            width={52}
            height={52}
          />
          <div className="flex items-center justify-between gap-2">
            {isUploading ? "Adding Photo" : "Add Photo"}
            {isUploading && <Loader2 className="animate-spin" />}
          </div>
          <span className="flex items-center justify-center gap-2 p-1 px-2 bg-[#FFFFFF99] rounded-full ">
            8x{" "}
            <NextImage
              src={"/image-icon.svg"}
              alt=""
              height={20}
              width={20}
              className="w-[20px] h-auto"
            />
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default DesignLayers;
