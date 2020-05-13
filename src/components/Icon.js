import React from "react";

import "@mdi/font/css/materialdesignicons.css";

export default ({
  name,
  light,
  dark,
  inactive,
  color,
  size = "calc(3vw + 3vh)",
}) => {
  let className = `mdi mdi-${name}`;
  if (light) className += " mdi-light";
  if (dark) className += " mdi-dark";
  if (inactive) className += " mdi-inactive";
  return <i className={className} style={{ color: color, fontSize: size }}></i>;
};
