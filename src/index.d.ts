/* This resolves the error
 * "Cannot find module '../../assets/images/image.png' or its corresponding type declarations"
 * when importing the image in a component or building web-ui.
 */
declare module '*.png';

/**
 * Required to import CSS modules
 */
declare module '*.module.css';
