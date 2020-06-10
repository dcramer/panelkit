import React from "react";

export type ThumbnailProps = {
  url: string;
  alt?: string;
};

export default ({ url, alt = "", ...props }: ThumbnailProps) => {
  return <img src={url} alt={alt} {...props} />;
};
