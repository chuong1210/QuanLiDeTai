"use client";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import HeadlessTippy from "@tippyjs/react/headless";
import { useRouter } from "next/navigation";
import imageAsset from "/public/images/huit/logo.png";
import { Tooltip } from "primereact/tooltip";
import { Badge } from "primereact/badge";
import Image from "next/image";
import { MenuItemType } from "@/assets/types/menu";
import { ROUTES } from "@/assets/config";
import { useGetList } from "@/assets/useHooks/useGet";
import {
  NotificationParamType,
  NotificationType,
  InviteParamType,
  InviteType,
} from "@/assets/interface";
import { useUserStore } from "@/assets/zustand/user";
import { HEADER_ITEM } from "@/assets/config/menu/header_menu";
import { useState } from "react";

const Header = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const notifiQuery = useGetList<InviteType, InviteParamType>({
    module: "notification",
  });
  const countNoti: number = notifiQuery.data?.result?.length ?? 0;

  const start = (
    <Image
      onClick={() => router.push(ROUTES.home.index)}
      alt="logo"
      src={imageAsset}
      height="50"
      width="50"
      className="mr-2 cursor-pointer"
    />
  );

  const headerItems = HEADER_ITEM();

  return (
    <header
      style={{
        zIndex: 1000,
        backgroundColor: "#fafafa",
        padding: "0.3rem 1rem",
      }}
    >
      <div
        style={{ marginLeft: "1rem", marginRight: "1rem", maxWidth: "100%" }}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {headerItems.map((item) => (
              <HeadlessTippy
                key={item.code}
                interactive={true}
                placement="bottom"
                render={() => (
                  <div className="p-2 border border-gray-300 rounded shadow-lg bg-white">
                    <h6 className="font-bold">{item.label}</h6>
                    {item.items?.map((subItem) => (
                      <div
                        key={subItem.code}
                        className="py-1 cursor-pointer"
                        onClick={() => router.push(subItem.to!)}
                      >
                        {subItem.label}
                      </div>
                    ))}
                  </div>
                )}
              >
                <div className="menu-item cursor-pointer flex items-center">
                  {item.icon && <i className={`${item.icon} mr-1`} />}
                  <span>{item.label}</span>
                </div>
              </HeadlessTippy>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Avatar
              label={user?.name ? user.name[0].toUpperCase() : "C"}
              className="p-text-white p-shadow-4 bg-blue-400 font-bold"
              size="normal"
              shape="circle"
            />
            <HeadlessTippy
              interactive={true}
              placement="bottom"
              render={() => (
                <div className="p-2 border border-gray-300 rounded shadow-lg bg-white">
                  <h6 className="font-bold">Notifications</h6>
                  {countNoti > 0 ? (
                    <div className="py-1">
                      You have {countNoti} notifications.
                    </div>
                  ) : (
                    <div className="py-1">No notifications.</div>
                  )}
                </div>
              )}
            >
              <Button
                label="Thông báo"
                rounded
                size="small"
                className="p-button-rounded p-button-primary custom-target-icon mr-4"
                icon="pi pi-bell"
              />
            </HeadlessTippy>
            {countNoti > 0 && (
              <Badge
                size="normal"
                value={countNoti}
                style={{
                  position: "absolute",
                  marginTop: "0",
                  right: "18px",
                  transition: "all 0.4s ease",
                }}
                severity="warning"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
