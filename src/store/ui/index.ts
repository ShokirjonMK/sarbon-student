import { createSlice } from "@reduxjs/toolkit";

export interface IUi {theme: "flat" | "dark" | "light" | "blue", sidebar: "large" | "small" | "none", language: string};

const defaultInitialState: IUi = {theme: "light", sidebar: "large", language: "uz"};

const Ui = createSlice({
  name: "ui",
  initialState: defaultInitialState,
  reducers: {
    changeTheme: (state, { payload }) => {
      localStorage.setItem('theme', payload);
      state.theme = payload
    },
    changeSidebar: (state, { payload }) => {
      sessionStorage.setItem("sidebar", payload)
      state.sidebar = payload
    },
    changeLocaleLanguage: (state, { payload }) => {
      sessionStorage.setItem("i18lang", payload)
      state.language = payload
    },
  }
});


export const {changeTheme, changeSidebar, changeLocaleLanguage} = Ui.actions;
export default Ui.reducer;