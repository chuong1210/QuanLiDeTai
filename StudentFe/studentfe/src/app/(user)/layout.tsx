import { cookies } from "@/assets/helpers";
import { PageProps } from "@/assets/types/UI";
import { Header, Sidebar } from "@/resources/components/layout";
import HeaderTippy from "@/resources/components/layout/HeaderTippy";
import { ToastContainer } from "react-toastify";

// export async function getServerSideProps(context: { req: any }) {
//   const { req } = context;
//   const userRole = cookies.get(req);

//   if (userRole === "admin" || userRole === "user") {
//     return { props: {} };
//   } else {
//     return {
//       redirect: {
//         destination: "/unauthorized",
//         permanent: false,
//       },
//     };
//   }
// }
const AuthLayout = ({ children }: PageProps) => {
  return (
    <body className="min-h-screen surface-100 overflow-hidden m-0">
      <Header />
      {/* <HeaderTippy /> */}

      <div className="flex gap-3">
        <Sidebar />
        <div
          className="py-3 overflow-auto pr-3 h-screen"
          style={{ width: "calc(100vw - 17rem)" }}
        >
          {children}
        </div>
      </div>

      {/* <ToastContainer /> */}
    </body>
  );
};

export default AuthLayout;
