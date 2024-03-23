import { PageProps } from "@/assets/types/UI";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { lng },
}: PageProps): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return {
    title: "Route invite",
  };
}

const Layout = ({ children }: PageProps) => {
  return children;
};

export default Layout;
