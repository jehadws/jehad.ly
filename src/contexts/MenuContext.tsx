import React from "react";

export type MenuContextType = {
  isOpened: boolean;
  setIsOpened?: (isOpened: boolean) => void;
  handleTogglingIsOpened?: () => void;
};

const MenuContext = React.createContext<MenuContextType>({
  isOpened: false,
  setIsOpened: () => {},
  handleTogglingIsOpened: () => {},
});

export default MenuContext;
