import { PageProps } from "@/assets/types/UI";
import { url } from "inspector";
import type { Metadata } from "next";

const Layout = ({ children }: PageProps) => {
  return children;
};

export const metadata: Metadata = {
  title: "Quản lí đề  tài",
  description: "Quản lí đề  tài",
};

export default Layout;
