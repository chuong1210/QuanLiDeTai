import { PageProps } from "@/assets/types/UI";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { lng },
}: PageProps): Promise<Metadata> {
  return {
    title: "Mời thành viên",
  };
}

const Layout = ({ children }: PageProps) => {
  return children;
};

export default Layout;
