import light from "./light";
import dark from "./dark";

export const themes = { light, dark };
export type ThemeName = keyof typeof themes;