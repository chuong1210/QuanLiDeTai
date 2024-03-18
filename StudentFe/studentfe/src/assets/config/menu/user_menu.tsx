import { MenuItemType } from "@/assets/types/menu";
import {
  FaArrowRightArrowLeft,
  FaArrowRightFromBracket,
  FaKey,
  FaUser,
} from "react-icons/fa6";
import { ROUTES } from "../";
import { FaHome } from "react-icons/fa";
import { useRef } from "react";
import { ChangePasswordModalRefType } from "@/assets/types/modal";
import { toast } from "react-toastify";
import { formChangePassword } from "@/assets/types/changePassword";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../apis/studentapi";

const USER_MENU = (pathName: string): MenuItemType[] => {
  let base: string = "http://localhost:3000";

  return [
    {
      code: "Home",
      parent: "Home",
      label: "Trang chủ",
      icon: <FaHome />,
      to: base + `${ROUTES.home.index}`,
    },
    {
      code: "info",
      parent: "info",
      label: "Thông tin cá nhân",
      icon: <FaUser />,
      to: `${pathName || "/home"}`,
    },

    {
      code: "change_faculty",
      parent: "change_faculty",
      label: "Đổi Khoa",
      icon: <FaArrowRightArrowLeft />,
    },
    {
      code: "change_password",
      parent: "change_password",
      label: "Đổi Mật Khẩu",
      icon: <FaKey />,
    },
    {
      code: "logout",
      parent: "logout",
      label: "Đăng xuất tài khoản",
      icon: <FaArrowRightFromBracket />,
      to: base + `${ROUTES.auth.sign_in}`,
    },
  ];
};

export { USER_MENU };
