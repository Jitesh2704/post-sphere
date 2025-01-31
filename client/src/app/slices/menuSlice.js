import { createSlice } from "@reduxjs/toolkit";

const savedMenu = JSON.parse(localStorage.getItem("selectedMenu"));

const initialState = {
  selectedMenu: savedMenu || "article", 
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedMenu: (state, action) => {
      state.selectedMenu = action.payload;
    },
  },
});

export const { setSelectedMenu } = menuSlice.actions;

export default menuSlice.reducer;
