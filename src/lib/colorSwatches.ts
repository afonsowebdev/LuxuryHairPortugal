import type { CSSProperties } from "react";

const SWATCHES: Record<string, string> = {
  "Honey Blonde": "#D4A039",
  "Preto Natural": "#1C1712",
  "Castanho Chocolate": "#4A2C1D",
  "Platinum Blonde": "#E9E2CC",
  "Castanho Acaju": "#5C2A1E",
  "Ombré Mel": "linear-gradient(135deg, #2B1A12 35%, #D4A039 100%)",
  Preto: "#0E0C0B",
};

const LIGHT_SWATCHES = new Set(["Platinum Blonde"]);

export function getSwatchStyle(colorName: string): CSSProperties {
  const value = SWATCHES[colorName] ?? "#9c8f97";
  return value.startsWith("linear-gradient") ? { backgroundImage: value } : { background: value };
}

export function isLightSwatch(colorName: string): boolean {
  return LIGHT_SWATCHES.has(colorName);
}
