import type { ChangeEvent } from 'react';
import { createContext } from 'react';
import type { Size } from '../types';

export interface RadioGroupContextValue {
  name: string;
  value?: string;
  size?: Size;
  invalid?: boolean;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);
