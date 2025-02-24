"use client";
import { Slider } from "@/components/ui/slider";
import { FONT_STYLES, TEXT_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CustomFabricObject, CustomTextBox } from "@/types";
import { Canvas, IText, TEvent, Textbox, TPointerEvent } from "fabric";
import Image from "next/image";
import { useEffect, useState } from "react";

const TextSettings = ({ canvas }: { canvas: Canvas | null }) => {
  const [currentInput, setCurrentInput] = useState("Text");
  const [activeTextObject, setActiveTextObject] = useState<
    CustomTextBox | CustomFabricObject | null
  >(null);
  const [currentFontSize, setCurrentFontSize] = useState<number[]>([80]);
  const [currentColor, setCurrentColor] = useState(TEXT_COLORS[0]);
  const [currentFontStyles, setCurrentFontStyles] = useState(FONT_STYLES[0]);

  const handleTextSelection = (
    e: Partial<TEvent<TPointerEvent>> & {
      selected: CustomFabricObject[];
      deselected: CustomFabricObject[];
    }
  ) => {
    if (!e.selected || e.selected[0].type !== "textbox") return;
    const selectedObject = e.selected ? e.selected[0] : null;
    if (selectedObject) {
      setActiveTextObject(selectedObject);
      setCurrentFontSize([selectedObject.get("fontSize")]);
      setCurrentInput(selectedObject.get("text"));
      const colorId = selectedObject.get("colorId");
      const targetColor = TEXT_COLORS.find((color) => color.id === colorId);
      if (targetColor) {
        const idx = TEXT_COLORS.indexOf(targetColor);
        selectedObject.colorId = TEXT_COLORS[idx].id;
        setCurrentColor(TEXT_COLORS[idx]);
      }

      const styleId = selectedObject.get("styleId");
      const targetStyle = FONT_STYLES.find((style) => style.id === styleId);
      if (targetStyle) {
        const idx = FONT_STYLES.indexOf(targetStyle);
        selectedObject.styleId = FONT_STYLES[idx].id;
        setCurrentFontStyles(FONT_STYLES[idx]);
      }
    }
  };

  const handleTextUpdate = (e: { target: IText }) => {
    if (!e.target) return;
    setCurrentInput(e.target.text || "");
  };

  useEffect(() => {
    if (!canvas) return;
    canvas.on("text:changed", handleTextUpdate);
    canvas.on("selection:created", handleTextSelection);
    canvas.on("selection:updated", handleTextSelection);
    canvas.on("selection:cleared", () => setActiveTextObject(null));

    const existObj = canvas.getActiveObjects()[0];
    if (existObj && existObj.type === "textbox") {
      canvas.discardActiveObject();
      canvas.setActiveObject(existObj);
      canvas.renderAll();
    }
    return () => {
      canvas.off("object:modified", handleTextUpdate);
      canvas.off("selection:created", handleTextSelection);
      canvas.off("selection:updated", handleTextSelection);
      canvas.off("selection:cleared", () => setActiveTextObject(null));
    };
  }, [canvas]);

  const AddTextElement = () => {
    if (!canvas) return;
    const newText = new Textbox(currentInput, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      minScaleLimit: 0.5,
      strokeWidth: 1,
      strokeUniform: true,
      originX: "center",
      originY: "center",
      cornerColor: "#B6F074",
      borderColor: "#B6F074",
      cornerStyle: "circle",
      cornerStrokeColor: "#B6F074",
      transparentCorners: false,
      centeredScaling: true,
      fontSize: currentFontSize[0],
      ...TEXT_COLORS[0].options,
      ...FONT_STYLES[0].options,
    }) as CustomTextBox;

    newText.styleId = FONT_STYLES[0].id;
    newText.colorId = TEXT_COLORS[0].id;
    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.renderAll();
    setActiveTextObject(newText);
  };

  useEffect(() => {
    if (!canvas || !activeTextObject) return;
    const center = activeTextObject.getCenterPoint();
    console.log(center);
    //const scale = activeTextObject.scaleX;
    console.log();
    activeTextObject.set({
      text: currentInput,
      colorId: currentColor.id,
      styleId: currentFontStyles.id,
      fontSize: currentFontSize[0],
      ...currentColor.options,
      ...currentFontStyles.options,
    });
    canvas.renderAll();
  }, [
    currentInput,
    canvas,
    currentFontSize,
    currentColor,
    currentFontStyles,
    activeTextObject,
  ]);

  return (
    <div className="flex flex-col gap-4">
      {activeTextObject && (
        <div className="flex flex-col gap-6">
          <input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={"Text"}
            className="w-full min-h-[56px] rounded-full border-[1px] border-solid border-borderBlack focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <div className="flex gap-4 items-center">
            <span className="whitespace-nowrap">Font size</span>
            <form className="w-full">
              <Slider
                value={currentFontSize}
                max={250}
                min={16}
                step={1}
                onValueChange={(value) => setCurrentFontSize(value)}
                className="cursor-pointer"
              />
            </form>
          </div>
          <div className="flex gap-2 flex-wrap">
            {TEXT_COLORS.map((color, index: number) => (
              <div
                key={color.id}
                onClick={() => setCurrentColor(TEXT_COLORS[index])}
                className={cn(
                  `p-[2px] rounded-full w-9 h-9 border-[2px] border-solid border-gray-200 hover:border-gray-300 cursor-pointer`,
                  currentColor.id === color.id ? "border-[#B6F074]" : ""
                )}
              >
                <div
                  style={{ backgroundColor: color.options.fill }}
                  className="rounded-full w-full h-full"
                ></div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap">
            {FONT_STYLES.map((font, index: number) => (
              <div
                onClick={() => setCurrentFontStyles(FONT_STYLES[index])}
                key={font.id}
                className={cn(
                  `py-[10px] px-4 bg-white rounded-full border-[2px] border-solid border-gray-200 hover:border-gray-300 cursor-pointer uppercase font-bold} min-w-[70px] flex items-center justif-center ${font.options.tw}`,
                  currentFontStyles.id === font.id ? "border-[#B6F074]" : ""
                )}
              >
                ABC
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="">
        <button
          onClick={AddTextElement}
          className=" w-full bg-[#B6F074]  rounded-[100px] px-3 py-2 min-h-[61px] flex justify-between items-center translate-y-[50%]"
        >
          <Image src={"/add-icon.svg"} alt="Add Image" width={52} height={52} />
          Add Text
          <span className="flex items-center justify-center gap-2 p-1 px-2 bg-[#FFFFFF99] rounded-full ">
            3x{" "}
            <Image
              src={"/text-tab.svg"}
              alt=""
              height={20}
              width={20}
              className="w-[20px] h-auto"
            />
          </span>
        </button>
      </div>
    </div>
  );
};

export default TextSettings;
