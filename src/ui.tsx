export enum Size {
  MOBILE = "600px",
  TABLET = "800px",
}

export const DeviceMedia: { [name: string]: string } = {
  // only screen and (max-width: xxx)
  MOBILE: `(max-width: ${Size.MOBILE})`,
  TABLET: `(max-width: ${Size.TABLET})`,

  LANDSCAPE: "(max-aspect-ratio: 16/9)",
  PORTRAIT: "(max-aspect-ratio: 9/16)",
};
