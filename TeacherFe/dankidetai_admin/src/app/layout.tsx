import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/resources/styles/index.css"
import 'react-toastify/dist/ReactToastify.css';
import { APIOptions, PrimeReactProvider } from 'primereact/api';
import 'moment/locale/vi';

import ProviderQuery from "@/assets/middleware/reactQueryProvider";
import { ReduxProviders } from "@/assets/middleware/reduxProvider";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });


export async function generateMetadata(): Promise<Metadata> {

  return {
    title: "HUIT",
    description: "Đăng kí đề tài khóa luận"
  };
}

const primeReactValue: Partial<APIOptions> = {
  ripple: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ProviderQuery>
        <ReduxProviders>
          <PrimeReactProvider value={primeReactValue}>
            <body suppressHydrationWarning={true} className={inter.className}>
              <main className="main">
                <ToastContainer />
                {children}
              </main>
            </body>
          </PrimeReactProvider>
        </ReduxProviders>
      </ProviderQuery>
    </html>
  );
}
