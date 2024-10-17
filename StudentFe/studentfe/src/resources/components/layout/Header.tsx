"use client";

import { cookies } from "@/assets/helpers";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import HeadlessTippy from "@tippyjs/react/headless";
import { useRouter } from "next/navigation";
import { API, ROUTES } from "@/assets/config";
import imageAsset from "/public/images/huit/logo.png";

import { Breadcrumb } from "../UI";
import { FaHome } from "react-icons/fa";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import Image from "next/image";
import { MenuItemType } from "@/assets/types/menu";
import Link from "next/link";
import { useGetList } from "@/assets/useHooks/useGet";
import {
  InviteParamType,
  InviteType,
  NotificationParamType,
  NotificationType,
} from "@/assets/interface";
import moment from "moment";
import { MenuItem } from "primereact/menuitem";
import { Divider } from "primereact/divider";
import { Tooltip } from "primereact/tooltip";
import { Badge } from "primereact/badge";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { HEADER_ITEM } from "@/assets/config/menu/header_menu";
import { useStore } from "zustand";
import { useUserStore } from "@/assets/zustand/user";

const Header = () => {
  const { isLoading, response } = useGetList<
    NotificationType,
    NotificationParamType
  >({
    module: "notification",
  });
  //http://localhost:8888/notification?filters=lastModifiedDate%3E%3Dyyyy-07-22
  const notifiQuery = useGetList<InviteType, InviteParamType>({
    module: "notification",
  });
  const { user } = useUserStore();

  const countNoti: number = notifiQuery.data?.result?.length ?? 0;
  const router = useRouter();
  const headerItems = HEADER_ITEM();
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
      className: item.itemClassName || "custom-menu-item",
      style: { fontWeight: "bold", maxWidth: "2rem" },
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

  const getFirstLetter = (name: String) => {
    return name ? name[0].toUpperCase() : "";
  };
  const firstLetter = getFirstLetter(user?.name ?? "C");

  const itemsWithCommands: MenuItem[] = headerItems.map(convertToMenuItem);
  const handleHover = (label: string) => {
    const hoverCard = document.getElementById(`hover-${label}`);
    if (hoverCard) hoverCard.style.display = "block";
  };

  const handleHoverOut = () => {
    document.querySelectorAll<HTMLElement>(".hover-card").forEach((el) => {
      el.style.display = "none";
    });
  };

  return (
    <header
      style={{
        zIndex: "1000",
        backgroundColor: "#fafafa",
        padding: "0.3rem 1rem",
      }}
    >
      <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
        {/* <Breadcrumb /> */}
        <Menubar
          start={start}
          model={itemsWithCommands}
          className="flex justify-content-around"
          menuIcon
          end={
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.1rem" }}
            >
              <Avatar
                label={firstLetter}
                className="p-text-white m-0 text-white p-shadow-4  font-bold bg-blue-400"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#486af4",
                  borderRadius: "50%",
                  lineHeight: "1.2",
                  height: "20px",
                  width: "20px",
                }}
              />
              <Link href={`${ROUTES.information.notification}/`}>
                <Tooltip target=".custom-target-icon" />
                {/* <i
                className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge"
                data-pr-tooltip="No notifications"
                data-pr-position="right"
                data-pr-at="right+5 top"
                data-pr-my="left center-2"
                style={{
                  fontSize: "2rem",
                  cursor: "pointer",
                  marginRight: "5rem",
                }}
              >
                <Badge severity="danger"></Badge>
              </i> */}

                <Button
                  label="Thông báo"
                  rounded
                  size="small"
                  className="p-button-rounded p-button-primary  bg-blue-400 border-0 custom-target-icon mr-4 "
                  icon="pi pi-bell"
                  data-pr-tooltip={
                    countNoti <= 0
                      ? "Không có thông báo"
                      : `Có ${countNoti} thông báo`
                  }
                  data-pr-position="right"
                  data-pr-at="right+5 top"
                  data-pr-my="left center-2"
                />

                {countNoti > 0 ? (
                  <Badge
                    size={"normal"}
                    value={countNoti}
                    style={{
                      position: "absolute",
                      marginTop: "0",
                      right: "18px",
                      transition: "all 0.4s ease",
                      marginRight: "2.5rem",
                    }}
                    severity="warning"
                  ></Badge>
                ) : null}
              </Link>
            </div>
          }
        />
      </div>
    </header>
  );
};

export default Header;
