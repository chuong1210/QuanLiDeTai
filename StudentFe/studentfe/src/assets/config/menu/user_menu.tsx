import { MenuItemType } from "@/assets/types/menu";
import {
  FaArrowRightArrowLeft,
  FaArrowRightFromBracket,
  FaKey,
  FaUser,
} from "react-icons/fa6";
import { ROUTES } from "../";
import { FaHome } from "react-icons/fa";

const USER_MENU = (pathName: string): MenuItemType[] => {
  const base: string = "http://localhost:3000";

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
      // to: base + `${pathName || "/home"}`,
      to: base + `${ROUTES.profile.student}/${1}`,
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
