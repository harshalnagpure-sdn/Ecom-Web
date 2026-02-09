import React, { useState, useEffect } from "react";

export default function ColorPicker({ colors = [], selectedColor, onColorChange }) {
  console.log("Harshal 22");
  console.log("updatd");
  
  // Extract unique colors from variants if colors array is empty
  const [selected, setSelected] = useState(selectedColor ?? null);
  useEffect(() => {
    if (selectedColor !== undefined) {
      setSelected(selectedColor);
    }
  }, [selectedColor]);
  

  const handleColorSelect = (color) => {
    const colorValue = color.hex_value || color.code;
    setSelected(colorValue);
    if (onColorChange) {
      onColorChange(color.label || color.name, colorValue);
    }
  };

  // Function to check if a color is white or very light
  const isLightColor = (hex) => {
    if (!hex) return false;
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    // Convert to RGB
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Consider colors with luminance > 0.7 as light colors
    return luminance > 0.7;
  };

  // If no colors provided, show default colors
  const displayColors = colors.length > 0 ? colors : [
    { name: "Beige", code: "#b8ada3", hex_value: "#b8ada3" },
    { name: "Dark Brown", code: "#4f4342", hex_value: "#4f4342" },
    { name: "Cyan", code: "#39d4e7", hex_value: "#39d4e7" },
    { name: "Pink", code: "#e8a0b1", hex_value: "#e8a0b1" },
    { name: "Yellow", code: "#f2dd62", hex_value: "#f2dd62" },
  ];

  if (displayColors.length === 0) {
    return <p className="text-gray-500 text-sm">No colors available</p>;
  }

  return (
    <div className="flex items-center gap-5">
      {displayColors.map((c, index) => {
        const colorValue = c.hex_value || c.code;
        const isSelected = colorValue === selected;
        const isLight = isLightColor(colorValue);

        return (
          <button
            key={c.id || c.label || c.name || index}
            onClick={() => handleColorSelect(c)}
            className="relative h-[40px] w-[40px] rounded-full flex items-center justify-center transition hover:scale-105"
            style={{ backgroundColor: colorValue }}
            title={c.label || c.name}
          >
            {isSelected && (
              <span className="absolute inset-0 rounded-full flex items-center justify-center">
                <div className={`rounded-full border-4 ${
                  isLight ? "border-black" : "border-[#ffffff]"
                }`}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke={isLight ? "black" : "white"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 10l3 3 7-7" />
                  </svg>
                </div>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
