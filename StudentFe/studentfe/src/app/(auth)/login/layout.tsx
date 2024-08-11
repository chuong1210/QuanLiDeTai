import React from "react";
import Image from "next/image";
import { PageProps } from "@/assets/types/UI";
import imageAsset from "/public/images/huit/brand.png";

const Layout = ({ children }: PageProps) => {
  return (
    <div className="container layer-2">
      <Image
        src={imageAsset} // Thay thế bằng đường dẫn ảnh nền
        alt="Background image"
        layout="fill" // Căn chỉnh ảnh nền cho phù hợp với kích thước container
        objectFit="cover"
        style={{ position: "absolute", zIndex: -1 }} // Điều chỉnh kích thước ảnh nền cho phù hợp với container
      />
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
