import { PageProps } from "@/assets/types/UI";
import { ToastContainer } from "react-toastify";

const AuthLayout = ({ children }: PageProps) => {
  return (
    <body className="h-screen relative p-4 sm:p-4 md:p-6 lg:px-8 lg:h-screen xl:h-screen surface-300 m-0">
      {children}
      <ToastContainer />
    </body>
  );
};

export default AuthLayout;
