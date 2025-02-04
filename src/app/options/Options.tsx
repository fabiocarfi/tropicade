"use-client";
import { Sun } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { TshirtColorsType, TshirtSizes } from "../../lib/tshirts-data";
import { Dispatch, SetStateAction, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const Options = ({
  allTShirtColors,
  currentTShirtColor,
  setCurrentTShirtColor,
}: {
  allTShirtColors: TshirtColorsType[] | null;
  currentTShirtColor: TshirtColorsType;
  setCurrentTShirtColor: Dispatch<SetStateAction<TshirtColorsType>>;
}) => {
  type TabsType = "COLOR" | "SIZE" | "TEXT";
  const [activeTab, setActiveTab] = useState<TabsType>("COLOR");

  return (
    <div className="w-full h-ful">
      <Tabs defaultValue="design">
        <TabsList>
          <TabsTrigger value="design" onClick={() => setActiveTab("COLOR")}>
            <div className="w-12 h-12 relative flex items-center justify-center">
              {activeTab === "COLOR" ? (
                <Image
                  width={48}
                  height={48}
                  alt="color icon"
                  src={"/color-dark.png"}
                  className="absolute"
                />
              ) : (
                <Image
                  width={48}
                  height={48}
                  alt="color icon"
                  src={"/color-light.png"}
                  className="absolute"
                />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="size" onClick={() => setActiveTab("SIZE")}>
            <div className="w-12 h-12 relative flex items-center justify-center">
              {activeTab === "SIZE" ? (
                <Image
                  width={48}
                  height={48}
                  alt="color icon"
                  src={"/size-dark.png"}
                  className="absolute"
                />
              ) : (
                <Image
                  width={48}
                  height={48}
                  alt="color icon"
                  src={"/size-light.png"}
                  className="absolute"
                />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="text" onClick={() => setActiveTab("TEXT")}>
            <div className="w-12 h-12 relative flex items-center justify-center">
              {activeTab === "TEXT" ? (
                <Image
                  width={48}
                  height={48}
                  alt="color icon"
                  src={"/text-dark.png"}
                  className="absolute"
                />
              ) : (
                <Image
                  width={48}
                  height={48}
                  alt="color icon"
                  src={"/text-light.png"}
                  className="absolute"
                />
              )}
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="design">
          <ScrollArea className="h-[550px] w-full rounded-md py-4">
            <div className="p-4 bg-[#EBEBEB] rounded-[32px]">
              <h3 className="text-[24px] font-medium">T-Shirt Colors</h3>
              <div className="mt-4 md:mt-8">
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
          <div className="p-4 bg-[#EBEBEB] rounded-[32px]">
            <h3 className="text-[24px] font-medium">T-Shirt Size</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {TshirtSizes.map((tshirt) => (
                <span
                  key={tshirt.label}
                  className="flex items-center justify-center w-full rounded-full border-[1px] border-solid border-borderBlack min-h-[56px] hover:bg-primary hover:text-white cursor-pointer"
                >
                  {tshirt.size}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="text">
          <div className="p-4 bg-[#EBEBEB] rounded-[32px]">
            <h3 className="text-[24px] font-medium">T-Shirt Text</h3>
            <div className="flex flex-col gap-4 mt-4">
              <input
                placeholder="Main Text"
                className="w-full min-h-[56px] rounded-full border-[1px] border-solid border-borderBlack focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                placeholder="2nd Text"
                className="w-full min-h-[56px] rounded-full border-[1px] border-solid border-borderBlack focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                placeholder="Bottom Text"
                className="w-full min-h-[56px] rounded-full border-[1px] border-solid border-borderBlack focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Options;
