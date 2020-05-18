import React from "react";

export type ThumbnailProps = {
  result: {
    content: string;
    content_type: string;
  };
  alt?: string;
};

export default ({
  result: { content, content_type },
  alt = "",
  ...props
}: ThumbnailProps) => (
  <img src={`data:${content_type};base64,${content}`} alt={alt} {...props} />
);
