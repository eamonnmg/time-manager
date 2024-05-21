import chroma from "chroma-js";

export function calcIdealTextColorFromBg(bgcolor: string) {
  if (!bgcolor) return "#000";
  // chroma throws error if color is not valid
  try {
    // use white text if contrast acceptable
    const contrast = chroma.contrast("#fff", bgcolor);
    return contrast - 4.5 >= 0 ? "white" : "black";
  } catch {
    return "black";
  }
}
