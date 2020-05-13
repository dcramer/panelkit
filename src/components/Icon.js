import React from "react";
import MdiIcon from "@mdi/react";

const ICONS = {};

export const loadIcons = (data) => {
  Object.keys(data).forEach((k) => {
    ICONS[k] = data[k];
  });
};

export default ({ name, size = 4, ...props }) => {
  return <MdiIcon path={ICONS[name]} size={size} {...props} />;
};
