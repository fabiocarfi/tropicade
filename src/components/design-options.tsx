"use-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TshirtColorsType, TshirtSizesType } from "@/types";
import { Canvas } from "fabric";
import Image from "next/image";
import TextSettings from "./text-settings";

const DesignOptions = ({
  allTShirtColors,
  currentTShirtColor,
  setCurrentTShirtColor,

  TshirtSizes,
  selectedSize,
  setSelectedSize,
  canvas,
}: {
  allTShirtColors: TshirtColorsType[] | null;
  currentTShirtColor: TshirtColorsType;
  setCurrentTShirtColor: Dispatch<SetStateAction<TshirtColorsType>>;
  canvas: Canvas | null;
  selectedSize: TshirtSizesType;
  TshirtSizes: TshirtSizesType[];
  setSelectedSize: Dispatch<
    SetStateAction<{
      label: string;
      size: string;
    }>
  >;
  onOpenModel: Dispatch<SetStateAction<boolean>>;
}) => {
  type TabsType = "DESIGN" | "SIZE" | "TEXT";
  const [activeTab, setActiveTab] = useState<TabsType>("DESIGN");
  const tabRef = useRef(null);

  // const setTab = () => {
  //   const activeObjs = canvas?.getActiveObjects();
  //   if (activeObjs && activeObjs[0]?.type === "textbox") {
  //     tabRef.current.click();
  //     console.log(tabRef);
  //     setActiveTab("TEXT");
  //   }
  // };
  // useEffect(() => {
  //   if (!canvas) return;
  //   canvas.on("selection:created", setTab);
  //   canvas.on("selection:updated", setTab);
  // }, [canvas]);

  // const handleSize = (tshirt: TshirtSizesType) => {
  //   setSelectedSizes((prev) =>
  //     prev.includes(tshirt)
  //       ? prev.filter((shirt) => shirt !== tshirt)
  //       : [...prev, tshirt]
  //   );
  // };

  const handleSize = (tshirt: TshirtSizesType) => {
    setSelectedSize(tshirt);
  };

  return (
    <div className="w-full h-ful">
      <Tabs defaultValue="design">
        <TabsList className=" gap-4 justify-center xs:justify-stretch">
          <TabsTrigger
            className={cn(
              "xs:w-full flex items-end justify-center flex-shrink-0 xs:flex-shrink py-5 rounded-full bg-white w-[64px] h-[64px]  xs:bg-transparent",
              activeTab === "DESIGN"
                ? "opacity-100 font-medium bg-[#B6F074] xs:bg-white "
                : "font-normal"
            )}
            value="design"
            onClick={() => setActiveTab("DESIGN")}
          >
            <div
              className={cn(
                "w-full relative flex items-center justify-center gap-2",
                activeTab === "DESIGN" ? "opacity-100" : "opacity-50"
              )}
            >
              <Image
                width={20}
                height={20}
                alt="color icon"
                src={"/colors-tab.svg"}
              />
              <span className="hidden xs:block">Colors</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              "xs:w-full flex items-end justify-center flex-shrink-0 xs:flex-shrink py-5 rounded-full bg-white w-[64px] h-[64px]  xs:bg-transparent relative",
              activeTab === "SIZE"
                ? "opacity-100 font-medium bg-[#B6F074] xs:bg-white"
                : "font-normal"
            )}
            value="size"
            onClick={() => setActiveTab("SIZE")}
          >
            <span
              className={cn(
                " text-xs absolute right-0 top-0  bg-[#B6F074] py-[2px] px-[8px] rounded-full border-solid xs:border-none  border-[2px]",
                activeTab === "SIZE" ? " border-white" : "border-transparent"
              )}
            >
              {selectedSize.size}
            </span>
            <div
              className={cn(
                "w-full relative flex items-center justify-center gap-2",
                activeTab === "SIZE" ? "opacity-100" : "opacity-50"
              )}
            >
              <Image
                width={20}
                height={20}
                alt="color icon"
                src={"/size-tab.svg"}
              />
              <span className="hidden xs:block">Size</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              "xs:w-full flex items-end justify-center flex-shrink-0 xs:flex-shrink py-5 rounded-full bg-white w-[64px] h-[64px]  xs:bg-transparent",
              activeTab === "TEXT"
                ? "opacity-100 font-medium bg-[#B6F074] xs:bg-white"
                : "font-normal"
            )}
            ref={tabRef}
            value="text"
            onClick={() => setActiveTab("TEXT")}
          >
            <div
              className={cn(
                "w-full relative flex items-center justify-center gap-2",
                activeTab === "TEXT" ? "opacity-100" : "opacity-50"
              )}
            >
              <Image
                width={20}
                height={20}
                alt="color icon"
                src={"/text-tab.svg"}
              />
              <span className="hidden xs:block">Text</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="bg-white rounded-[40px]">
          <ScrollArea className="h-[550px] w-full rounded-md">
            <div className="p-4 bg-white rounded-[32px]">
              <h3 className="text-[24px] ">T-Shirt Colors</h3>
              <div className="mt-4 md:mt-6">
                <div className="flex flex-col gap-4">
                  {allTShirtColors?.map((tshirtColor) => (
                    <div
                      onClick={() => setCurrentTShirtColor(tshirtColor)}
                      key={tshirtColor.slug}
                      style={{
                        backgroundColor:
                          currentTShirtColor.slug === tshirtColor.slug
                            ? "#000"
                            : "transparent",
                        color:
                          currentTShirtColor.slug === tshirtColor.slug
                            ? "#fff"
                            : "#000",
                      }}
                      className="flex justify-between items-center py-2 px-4 border-[1px] border-solid cursor-pointer border-[#1113172B] rounded-full text-[#1113178C]"
                    >
                      <span>{tshirtColor.label}</span>
                      <span
                        style={{ backgroundColor: tshirtColor.value }}
                        className={cn(
                          "flex justify-center items-center w-10 h-10 rounded-full border-solid border-2 border-[#FFFFFF33]"
                        )}
                      >
                        {tshirtColor.slug === currentTShirtColor.slug && (
                          <Sun className="opacity-50 mix-blend-difference" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="size">
          <div className="p-4 bg-white rounded-[40px]">
            <h3 className="text-[24px] ">T-Shirt Sizes</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {TshirtSizes.map((tshirt) => (
                <span
                  key={tshirt.label}
                  onClick={() => handleSize(tshirt)}
                  className={cn(
                    "flex items-center justify-center w-full rounded-full border-[1px] border-solid border-borderBlack min-h-[56px] hover:bg-primary hover:text-white cursor-pointer",
                    selectedSize.label === tshirt.label
                      ? "bg-black text-white"
                      : ""
                  )}
                >
                  {tshirt.size}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="text">
          <div className="p-4 bg-white rounded-[40px]">
            <h3 className="text-[24px] ">T-Shirt Text</h3>
            <div className="flex flex-col gap-4 mt-4">
              <TextSettings canvas={canvas} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignOptions;
