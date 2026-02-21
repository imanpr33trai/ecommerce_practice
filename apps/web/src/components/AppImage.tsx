"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { Spinner } from "@comp/Spinner";

function Img({ className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 z-10 grid place-items-center">
          <Spinner variant="bars" />
        </div>
      )}

      <Image
        {...props}
        className={`${className ?? ""} ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default Img;
