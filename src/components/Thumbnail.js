import React from "react";

export default ({ result: { content, content_type }, ...props }) => (
  <img src={`data:${content_type};base64,${content}`} alt="" {...props} />
);
