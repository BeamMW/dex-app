import React from "react";

import useLoadImage from "@app/hooks/useLoadImage";

export default function SuspenseImage({ src, alt = "", ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) {
  try{
    console.log("src",src);
    useLoadImage(src ?? "").read();
  } catch(e) {
    console.log(e);
  }
  

  return <img src={src} alt={alt} {...rest} />;
}
