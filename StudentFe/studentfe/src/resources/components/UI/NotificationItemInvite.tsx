"use client";
import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import moment from "moment";
import { MenuItemType } from "@/assets/types/menu";
import { NotificationItemProps } from "@/assets/types/UI"; // Interface for props
import { MenuItem } from "primereact/menuitem";

const NotificationItem = ({
  notification,
  index,
  onAccept,
  onReject,
  menuRef,
  handleMenuToggle,
}: NotificationItemProps) => {
  const menuItems: MenuItemType[] = [
    {
      label: "Từ chối",
      icon: "pi pi-trash",
      command: () => onReject(notification),
    },
    {
      label: "Chấp nhận",
      icon: "pi pi-check",
      command: () => onAccept(notification),
    },
  ];

  // Map custom menu items to PrimeReact MenuItems
  const mapMenuItemTypeToMenuItem = (menuItems: MenuItemType[]): MenuItem[] => {
    return menuItems.map((item) => ({
      label: item.label,
      icon: typeof item.icon === "string" ? item.icon : undefined,
      items: item.items ? mapMenuItemTypeToMenuItem(item.items) : undefined,
      command: item.command ? () => item.command!(item) : undefined,
      separator: item.separator,
    }));
  };

  return (
    <Card key={index} className="notification-item">
      <div className="notification-content mb-5">
        <Avatar
          image="/images/avatar/waifu.jpg"
          className="e-round-corner"
          shape="circle"
          size="large"
        />
        <div className="notification-text">
          <h6 className="m-0 mt-1">{notification.sendFrom}</h6>
          <p className="mt-1">{notification.message}</p>
        </div>
        <div className="menu-container">
          <Menu
            model={mapMenuItemTypeToMenuItem(menuItems)}
            popup
            ref={(el) => (menuRef.current[index] = el)}
          />
          <Button
            icon="pi pi-ellipsis-v"
            onClick={(event) => handleMenuToggle(event, index)}
            className="p-button-text"
          />
          <p className="notification-time">
            {moment(notification.timeSent).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
