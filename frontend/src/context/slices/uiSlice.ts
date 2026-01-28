import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark";
  language: "fr" | "en";
}

const initialState: UIState = {
  theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
  language: (localStorage.getItem("language") as "fr" | "en") || "fr"
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setLanguage(state, action: PayloadAction<"fr" | "en">) {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    toggleLanguage(state) {
      state.language = state.language === "fr" ? "en" : "fr";
      localStorage.setItem("language", state.language);
    }
  }
});

export const { setTheme, toggleTheme, setLanguage, toggleLanguage } = uiSlice.actions;
export default uiSlice.reducer;