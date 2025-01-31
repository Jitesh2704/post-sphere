import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import menuReducer from "./slices/menuSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  const user = state.auth.user;
  const selectedMenu = state.menu.selectedMenu;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }

  if (selectedMenu) {
    localStorage.setItem("selectedMenu", JSON.stringify(selectedMenu));
  } else {
    localStorage.removeItem("selectedMenu");
  }
});

export { store };
