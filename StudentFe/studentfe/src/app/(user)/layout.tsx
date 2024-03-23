import { PageProps } from "@/assets/types/UI";
import { Header, Sidebar } from "@/resources/components/layout";
import { ToastContainer } from "react-toastify";

const AuthLayout = ({ children }: PageProps) => {
  return (
    <body className="min-h-screen surface-100 overflow-hidden m-0">
      <div className="flex gap-3">
        <Sidebar />
        <div
          className="py-3 overflow-auto pr-3 h-screen"
          style={{ width: "calc(100vw - 17rem)" }}
        >
          {children}
        </div>
      </div>

      <ToastContainer />
    </body>
  );
};

export default AuthLayout;
