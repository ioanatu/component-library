export const libSizes = ['sm', 'md', 'lg'] as const;
export type LibSize = (typeof libSizes)[number];

export const buttonVariants = ['primary', 'secondary', 'danger', 'success', 'accent'];
export type ButtonVariant = (typeof buttonVariants)[number];

export const chipVariants = ['primary', 'secondary', 'danger', 'success', 'accent'] as const;
export type ChipVariant = (typeof chipVariants)[number];
