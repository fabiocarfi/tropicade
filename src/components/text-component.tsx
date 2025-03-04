"use client";
import { FONT_STYLES, TEXT_COLORS } from "@/lib/constants";
import { CustomFabricObject, CustomTextBox } from "@/types";
import { Canvas, IText, TEvent, Textbox, TPointerEvent } from "fabric";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";

const TextComponent = ({ canvas }: { canvas: Canvas | null }) => {
  const [currentInput, setCurrentInput] = useState("Justice League");
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
      <div className="flex flex-col gap-6">
        <div className="bg-[#f7f8f9] relative rounded-full">
          <div className="text-muted-foreground text-xs absolute top-2 left-4">
            Header Text
          </div>
          <input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={"Justice League"}
            className="w-full min-h-[60px] rounded-full  focus:outline-none focus:ring-1 focus:ring-gray-400 bg-transparent pt-6"
            maxLength={24}
          />
          <div className="absolute right-[4px] top-[4px] bg-white rounded-full">
            <input
              className="w-[84px] min-h-[52px] rounded-full bg-white text-primary text-center"
              placeholder="16"
              value={16}
            />
          </div>
        </div>
        <Button onClick={() => AddTextElement()}>hello</Button>
      </div>
    </div>
  );
};

export default TextComponent;
