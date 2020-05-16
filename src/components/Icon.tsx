import React from "react";
import MdiIcon from "@mdi/react";

const ICONS = new Map();

export const loadIcons = (data: any) => {
  Object.keys(data).forEach((k) => {
    ICONS.set(k, data[k]);
  });
};

export type IconProps = {
  name: string;
  size?: number;
};

export default ({ name, size = 3, ...props }: IconProps) => {
  return <MdiIcon path={ICONS.get(name)} size={size} {...props} />;
};
