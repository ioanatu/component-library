import { createContext } from 'react';
import type { Size } from '../types';

export interface CheckboxGroupContextValue {
  name?: string;
  size?: Size;
  invalid?: boolean;
}

/* Undefined means a standalone checkbox, which is the common case. */
export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | undefined>(undefined);
