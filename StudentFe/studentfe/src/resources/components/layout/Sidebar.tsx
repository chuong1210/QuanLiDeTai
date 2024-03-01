// import {
//   ADMIN_MENU,
//   AUTH_RAW_TOKEN,
//   AUTH_TOKEN,
//   USER_MENU,
// } from "@/assets/configs";
// import useCookies from "@/assets/hooks/useCookies";
// import { AuthType } from "@/assets/interface";
// import { useDispatch } from "@/assets/redux";
// import menuSlice from "@/assets/redux/slices/menu/slice";
// import { MenuItemType } from "@/assets/types/menu";
// import { deleteCookie } from "cookies-next";
// import { usePathname } from "next/navigation";
// import { Avatar } from "primereact/avatar";
// import { OverlayPanel } from "primereact/overlaypanel";
// import { useRef } from "react";
// import { MenuItem } from "../UI";
// import { Divider } from "primereact/divider";

// const Menu = ({ lng }: LanguageType) => {
//   const adminMenu = ADMIN_MENU(t, lng);
//   const pathName = usePathname();
//   const userMenu = USER_MENU(t, lng, language.getRealPathName(pathName));
//   const [auth] = useCookies<AuthType>(AUTH_TOKEN);
//   const userModalRef = useRef<OverlayPanel>(null);
//   const dispatch = useDispatch();

//   const renderItem = (item: MenuItemType) => {
//     const onLogoutClick = () => {
//       deleteCookie(AUTH_TOKEN);
//       deleteCookie(AUTH_RAW_TOKEN);
//       dispatch(
//         menuSlice.actions.onItemClick({
//           activeItem: "home",
//           openMenu: false,
//           parent: "",
//         })
//       );
//     };

//     return (
//       <MenuItem
//         key={item.code}
//         permissions={auth?.permission || []}
//         item={{
//           ...item,
//           onItemClick: () => {
//             let event = () => {};

//             if (item.code === "logout") {
//               event = onLogoutClick;
//             }

//             event();
//           },
//         }}
//       />
//     );
//   };

//   return (
//     <div
//       className="flex flex-column gap-2 w-15rem h-screen relative"
//       style={{ zIndex: 1000, minWidth: "17rem" }}
//     >
//       <ul className="p-2 pt-0 overflow-y-auto h-full">
//         <div
//           className="flex align-items-center gap-2 cursor-pointer p-1 pr-3 bg-white hover:bg-blue-200"
//           style={{ borderRadius: 9999 }}
//           onClick={(e) => userModalRef?.current?.toggle(e)}
//         >
//           <Avatar
//             icon="pi pi-user"
//             className="bg-primary text-white border-circle"
//             size="large"
//           />
//           <div className="flex-1">
//             <p className="text-sm text-600 pb-1">{t("common:hello")}</p>
//             <p className="text-sm font-semibold">{auth?.customer.Name}</p>
//           </div>

//           <i className="pi pi-angle-down ml-2" />
//         </div>

//         <Divider layout="horizontal" />

//         {auth &&
//           adminMenu.map((item) => (
//             <MenuItem
//               key={item.code}
//               item={item}
//               permissions={auth?.permission}
//             />
//           ))}
//       </ul>

//       <OverlayPanel ref={userModalRef} className="px-2 py-1">
//         {userMenu.map(renderItem)}
//       </OverlayPanel>
//     </div>
//   );
// };

// export default Menu;
