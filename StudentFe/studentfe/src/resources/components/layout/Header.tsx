"use client";

import { cookies } from "@/assets/helpers";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import HeadlessTippy from "@tippyjs/react/headless";
import { useRouter } from "next/navigation";
import { API, ROUTES } from "@/assets/config";
import imageAsset from "@/resources/images/huit/logo.png";

import { Breadcrumb } from "../UI";
import { FaHome } from "react-icons/fa";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import Image from "next/image";
import { headerItems } from "@/assets/config/menu/header_menu";
import { MenuItemType } from "@/assets/types/menu";
import Link from "next/link";
import { useGetList } from "@/assets/useHooks/useGet";
import { NotificationParamType, NotificationType } from "@/assets/interface";
import moment from "moment";
import { MenuItem } from "primereact/menuitem";
import { Divider } from "primereact/divider";

const Header = () => {
  const { isLoading, response } = useGetList<
    NotificationType,
    NotificationParamType
  >({
    module: "notification",
    params: {
      filters: `lastModifiedDate>=${moment()
        .subtract({ day: 7 })
        .format("yyyy-MM-DD")}`,
    },
  });
  //http://localhost:8888/notification?filters=lastModifiedDate%3E%3Dyyyy-07-22
  const router = useRouter();
  const start = (
    <Image
      onClick={() => router.push(ROUTES.home.index)}
      alt="logo"
      src={imageAsset}
      height="50"
      width="50"
      className="mr-2 cursor-pointer "
    ></Image>
  );

  const convertToMenuItem = (item: MenuItemType): MenuItem => {
    let menuItem: MenuItem = {
      label: item.label,
      icon: item.icon,
      separator: item.separator,

      // ... chuyển đổi các thuộc tính khác nếu cần
    };

    if (item.items && item.items.length > 0) {
      menuItem.items = item.items.map(convertToMenuItem); // Chú ý đây phải là đệ quy chuyển đổi mỗi item con
    }

    if (item.to) {
      menuItem.command = () => {
        router.push(item.to!);
      };
    }

    return menuItem;
  };

  const itemsWithCommands: MenuItem[] = headerItems.map(convertToMenuItem);

  return (
    <header style={{ zIndex: "1000" }}>
      <Menubar
        start={start}
        model={itemsWithCommands}
        className="flex justify-content-around"
        menuIcon
        end={
          <Link href={`${ROUTES.information.notification}/`}>
            <Button label="Thông báo" rounded size="small" icon="pi pi-bell" />
          </Link>
        }
      />
    </header>
  );
};

export default Header;
