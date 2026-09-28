import { createContext } from 'react';

export interface MenuContextValue {
  close: (options?: { focusTrigger?: boolean }) => void;
}

export const MenuContext = createContext<MenuContextValue | undefined>(undefined);
