export const sizes = ['sm', 'md', 'lg'] as const;
export type Size = (typeof sizes)[number];

export const buttonVariants = ['primary', 'secondary', 'danger', 'success', 'accent'];
export type ButtonVariant = (typeof buttonVariants)[number];

/* ButtonNew names its variants after intent, following the OFFSET design system. */
export const buttonNewVariants = ['primary', 'secondary', 'ghost', 'destructive'] as const;
export type ButtonNewVariant = (typeof buttonNewVariants)[number];

export const chipVariants = ['default', 'success', 'warning', 'error', 'info'] as const;
export type ChipVariant = (typeof chipVariants)[number];

export const chipFills = ['outlined', 'filled'] as const;
export type ChipFill = (typeof chipFills)[number];

export const cardVariants = ['shadow', 'flat'] as const;
export type CardVariant = (typeof cardVariants)[number];
