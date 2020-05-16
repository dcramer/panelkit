export const toTitleCase = (str: string): string => {
  return str
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
    .replace("_", " ");
};