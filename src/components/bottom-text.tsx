"use client";

import { Canvas, Text } from "fabric";
import { useEffect, useState } from "react";

type CustomText = {
  textType: string;
} & Text;

const BottomText = ({ canvas }: { canvas: Canvas | null }) => {
  const [currentInput, setCurrentInput] = useState("");
  const [fontSize, setFontSize] = useState<number | string>(24);
  const [fabricText, setFabricText] = useState<CustomText | null>(null);

  useEffect(() => {
    if (!canvas) return;
    const createNewText = () => {
      const newText = new Text(currentInput, {
        left: canvas.width / 2,
        top: canvas.height - 0,
        strokeUniform: true,
        originX: "center",
        originY: "bottom",
        fontSize: Number(fontSize),
        selectable: false,
        textAlign: "center",
        textType: "bottom",
      }) as CustomText;
      return newText;
    };

    if (fabricText) {
      fabricText.set({
        top: canvas.height + Number(fontSize) / 5,
        text: currentInput,
        fontSize: Math.max(16, Number(fontSize)),
      });

      canvas.renderAll();
      return;
    }

    if (currentInput) {
      const newText = createNewText();
      setFabricText(newText);
      canvas.add(newText);
      canvas.renderAll();
      console.log(newText);
    } else {
      if (fabricText) canvas.remove(fabricText);
      setFabricText(null);
      canvas.renderAll();
    }
  }, [currentInput, fontSize, canvas, fabricText]);

  useEffect(() => {
    const existedText = canvas
      ?.getObjects()
      .filter(
        (obj): obj is CustomText =>
          "textType" in obj && obj.textType === "bottom"
      );
    if (existedText && existedText.length > 0) {
      setCurrentInput(existedText[0].text);
      setFontSize(existedText[0].fontSize);
      setFabricText(existedText[0]);
    }
  }, [canvas]);

  return (
    <div className="bg-[#f7f8f9] relative rounded-full">
      <div className="text-muted-foreground text-xs absolute top-2 left-4">
        Bottom text
      </div>
      <input
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        placeholder={""}
        className="w-full min-h-[60px] rounded-full  focus:outline-none focus:ring-1 focus:ring-gray-400 bg-transparent pt-6"
        maxLength={24}
      />
      <div className="absolute right-[4px] top-[4px] bg-white rounded-full">
        <input
          className="w-[84px] min-h-[52px] rounded-full bg-white text-primary text-center"
          placeholder="16"
          value={fontSize}
          onChange={(e) => {
            let value: number | string = e.target.value.replaceAll(/\D/g, "");
            value = Number(value);
            if (value > 400) value = 400;
            if (value === 0) value = "";
            setFontSize(value);
          }}
          type="number"
          min={16}
          max={200}
          maxLength={3}
        />
      </div>
    </div>
  );
};
export default BottomText;
