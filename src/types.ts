export const buttonSizes = ['sm', 'md', 'lg'] as const;
export type ButtonSize = (typeof buttonSizes)[number];

export const buttonVariants = ['primary', 'secondary', 'danger', 'success', 'accent'];
export type ButtonVariant = (typeof buttonVariants)[number];
