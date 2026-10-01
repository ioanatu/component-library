export const sizes = ['sm', 'md', 'lg'] as const;
export type Size = (typeof sizes)[number];

export const buttonVariants = ['primary', 'secondary', 'danger', 'success', 'accent'];
export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonNewVariants = ['primary', 'secondary', 'ghost', 'destructive'] as const;
export type ButtonNewVariant = (typeof buttonNewVariants)[number];

export const elevations = ['sm', 'md', 'lg'] as const;
export type Elevation = (typeof elevations)[number];

/**
 * Text-like input types only. Checkbox, radio and file behave nothing like a
 * text field and need their own components rather than the same frame.
 */
export const inputTypes = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'] as const;
export type InputType = (typeof inputTypes)[number];

/**
 * Directions the textarea's drag handle may offer. Horizontal is left out: it
 * breaks the measure the field sits in, and nothing is gained by a wider box.
 */
export const textAreaResizes = ['none', 'vertical'] as const;
export type TextAreaResize = (typeof textAreaResizes)[number];

export const orientations = ['vertical', 'horizontal'] as const;
export type Orientation = (typeof orientations)[number];

/** Kept as its own name for CheckboxGroup's published API. */
export const checkboxOrientations = orientations;
export type CheckboxOrientation = Orientation;

export const chipVariants = ['default', 'success', 'warning', 'error', 'info'] as const;
export type ChipVariant = (typeof chipVariants)[number];

export const chipFills = ['outlined', 'filled', 'transparent'] as const;
export type ChipFill = (typeof chipFills)[number];

/** flat drops the card's offset shadow; the rest set how far it sits. */
export const cardElevations = ['flat', 'sm', 'md', 'lg'] as const;
export type CardElevation = (typeof cardElevations)[number];

/** Preferred side for a tooltip. It flips to the opposite one on collision. */
export const tooltipPlacements = ['top', 'right', 'bottom', 'left'] as const;
export type TooltipPlacement = (typeof tooltipPlacements)[number];

export const toastTones = ['success', 'error', 'warning', 'info'] as const;
export type ToastTone = (typeof toastTones)[number];

export const toastPlacements = [
  'bottom-right',
  'bottom-left',
  'bottom-center',
  'top-right',
  'top-left',
  'top-center',
] as const;
export type ToastPlacement = (typeof toastPlacements)[number];

/** Corner a dropdown menu hangs from. It flips on collision. */
export const menuPlacements = ['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const;
export type MenuPlacement = (typeof menuPlacements)[number];

/** Tooltip fill. Named for the light theme: dark inverts, light sits on --surface. */
export const tooltipVariants = ['dark', 'light'] as const;
export type TooltipVariant = (typeof tooltipVariants)[number];

/** Avatar fill. Accent marks the current user; surface suits a group on --sunken. */
export const avatarTones = ['sunken', 'surface', 'accent'] as const;
export type AvatarTone = (typeof avatarTones)[number];
