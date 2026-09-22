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

export const chipVariants = ['default', 'success', 'warning', 'error', 'info'] as const;
export type ChipVariant = (typeof chipVariants)[number];

export const chipFills = ['outlined', 'filled'] as const;
export type ChipFill = (typeof chipFills)[number];

export const cardVariants = ['shadow', 'flat'] as const;
export type CardVariant = (typeof cardVariants)[number];
