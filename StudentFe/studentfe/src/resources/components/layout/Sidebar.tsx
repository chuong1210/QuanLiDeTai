"use client";

import useCookies from "@/assets/useHooks/useCookies";
import { AuthType } from "@/assets/interface";
import { useDispatch } from "@/assets/redux-toolkit";
import menuSlice from "@/assets/redux-toolkit/slices/menu/slice";
import { MenuItemType } from "@/assets/types/menu";
import { deleteCookie, getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import { use, useRef } from "react";
import { MenuItem } from "../UI/";
import { Divider } from "primereact/divider";
import { ADMIN_MENU } from "@/assets/config/menu/admin_menu";
import { USER_MENU } from "@/assets/config/menu/user_menu";
import {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  ROUTES,
  DATA_RESULT,
  API,
} from "@/assets/config";
import { useChangePassword } from "@/assets/useHooks/useChangePassword";
import { ChangePasswordModal } from "../modal";
import { cookies, http } from "@/assets/helpers";
import { useUser } from "@/assets/context/UserContext";
import { NextRequest } from "next/server";
import { useUserStore } from "@/assets/zustand/user";

const Menu = () => {
  const {
    changePasswordModalRef,
    onSave,
    onCancel,
    onShowChangePasswordModal,
  } = useChangePassword();
  const adminMenu = ADMIN_MENU();
  const pathName = usePathname();
  const userMenu = USER_MENU(pathName ?? "");
  const [auth] = useCookies<AuthType>(DATA_RESULT);
  const { user, hasGroup, setUser, setHasGroup } = useUserStore();
  console.log(user);
  const userModalRef = useRef<OverlayPanel>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  useCookies;
  // console.log(getCookie(REFRESH_TOKEN));
  const renderItem = (item: MenuItemType) => {
    const handleLogout = async () => {
      try {
        // Gọi API trên server để xử lý đăng xuất
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: getCookie(REFRESH_TOKEN) }), // Gửi accessToken
        });

        if (!response.ok) throw new Error("Logout failed");

        // Chuyển hướng về trang login hoặc trang chủ sau khi logout
        router.push("/login");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    const onLogoutClick = () => {
      handleLogout();
      deleteCookie(ACCESS_TOKEN);
      deleteCookie(REFRESH_TOKEN);
      // localStorage.removeItem("hasGroup");
      // localStorage.removeItem("user");

      // http.post(API.auth.sign_out, {
      //   token: getCookie(REFRESH_TOKEN),
      // });
      //  cookies.logOut();
      dispatch(
        menuSlice.actions.onItemClick({
          activeItem: "home",
          openMenu: false,
          parent: "",
        })
      );
    };
    const onChangePasswrod = () => {
      onShowChangePasswordModal();
    };
    return (
      <MenuItem
        key={item.code}
        permissions={user?.roles || []}
        item={{
          ...item,
          onItemClick: () => {
            let event = () => {};

            if (item.code === "logout") {
              event = onLogoutClick;
            }
            if (item.code === "change_password") {
              event = onChangePasswrod;
            }

            event();
          },
        }}
      />
    );
  };

  return (
    <div
      className="flex flex-column gap-2 w-15rem h-screen relative   "
      style={{ minWidth: "17rem" }}
    >
      <ul className="p-2 pt-0 overflow-y-auto h-full">
        <div
          className="flex align-items-center gap-2 cursor-pointer p-1 pr-3 bg-white hover:bg-blue-200"
          style={{ borderRadius: 9999 }}
          onClick={(e) => userModalRef?.current?.toggle(e)}
        >
          <Avatar
            icon="pi pi-user"
            className="bg-primary text-white border-circle"
            size="large"
          />
          <div className="flex-1">
            <p className="text-sm text-600 pb-1">{"Xin chào"}</p>
            <p className="text-sm font-semibold">{user?.username}</p>
          </div>

          <i className="pi pi-angle-down ml-2" />
        </div>

        <Divider layout="horizontal" />

        {user != null &&
          adminMenu.map((item) => (
            <MenuItem key={item.code} item={item} permissions={user.roles} />
          ))}
      </ul>
      <OverlayPanel ref={userModalRef} className="px-2 py-1">
        {userMenu.map(renderItem)}
      </OverlayPanel>
      <ChangePasswordModal
        ref={changePasswordModalRef}
        onSave={onSave}
        onCancel={onCancel}
        username={user?.username ?? ""}
      />
    </div>
  );
};

export default Menu;
