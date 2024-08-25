import React, { useEffect, useState, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Menu, MenuContext } from "primereact/menu";
import { useGetList } from "@/assets/useHooks/useGet";
import { InviteParamType, InviteType } from "@/assets/interface";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { http } from "@/assets/helpers";
import { API } from "@/assets/config";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import moment from "moment";
import { MenuItemType } from "@/assets/types/menu";
import { MenuItem } from "primereact/menuitem";
import { Skeleton } from "primereact/skeleton";
import { motion } from "framer-motion";
import imageAsset from "/public/images/avatar/waifu.jpg";

const NotificationList = () => {
  const menuRefs = useRef<(Menu | null)[]>([]);

  const inviteQuery = useGetList<InviteType, InviteParamType>({
    module: "notification",
    // params: {
    //   isGetGroup: true,
    // },
  });
  //useInfiniteQuery

  const observerRef = useRef<HTMLDivElement | null>(null);

  const [displayedNotifications, setDisplayedNotifications] = useState<any[]>(
    []
  );
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const containerVariants = {
    hidden: { height: "0px", opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.5 } },
  };
  const PAGE_SIZE = 10;
  const recallInviteMutate = useMutation({
    mutationFn: (data: InviteType) => {
      return http.update(API.put.invitation + `/${data.id}`, {
        statusInvitation: data.statusInvitation,
      });
    },
    onSuccess: () => {
      inviteQuery.refetch();
    },
  });

  const handleAccept = (notification: InviteType) => {
    // Tạo một bản sao của notification và cập nhật status
    const updatedNotification: InviteType = {
      // ...notification,
      id: notification.id,
      statusInvitation: "AOS",
    };
    recallInviteMutate.mutate(updatedNotification);
  };

  const handleReject = (notification: InviteType) => {
    // Tạo một bản sao của notification và cập nhật status
    const updatedNotification: InviteType = {
      // ...notification,
      id: notification.id,
      statusInvitation: "RE",
    };
    recallInviteMutate.mutate(updatedNotification);
  };

  const handleMenuToggle = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (menuRefs.current[index]) {
      menuRefs.current[index]?.toggle(event);
    }
  };
  const mapMenuItemTypeToMenuItem = (menuItems: MenuItemType[]): MenuItem[] => {
    return menuItems.map((item) => ({
      label: item.label,
      icon: typeof item.icon === "string" ? item.icon : undefined, // Ensure it's a string
      items: item.items ? mapMenuItemTypeToMenuItem(item.items) : undefined,
      command: item.command ? () => item.command!(item) : undefined, // Adapt command
      separator: item.separator,
      // Add any other property mappings as needed
    }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <div className="notifications-container  overflow-hidden  border-round-xl  shadow-2 flex flex-column ">
      <Card
        header={
          <div className="flex justify-content-center mt-2  h-3rem max-h-10rem   ">
            <p className="p-1">Danh sách thông báo</p>
            <i
              className="pi pi-arrow-circle-down ml-2 "
              style={{ fontSize: "2rem", cursor: "pointer" }}
              onClick={() => setIsExpanded(!isExpanded)}
            ></i>
          </div>
        }
        className="h-3rem max-h-10rem "
      ></Card>
      <Divider />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isExpanded ? "visible" : "hidden"}
        className="notifications-list"
      >
        {inviteQuery.data?.result && inviteQuery.data.result.length > 0 ? (
          <h6 className="notification-dialogue m-0">Tất cả lời mời của bạn:</h6>
        ) : (
          <h6 className="notification-dialogue">Bạn chưa có lời mời nào.</h6>
        )}
        <div className="notifications-list">
          {inviteQuery.isLoading && (
            <div className="card">
              <div className="border-round border-1 surface-border p-4">
                <ul className="m-0 p-0 list-none">
                  <li className="mb-3">
                    <div className="flex">
                      <Skeleton
                        shape="circle"
                        size="4rem"
                        className="mr-2"
                      ></Skeleton>
                      <div style={{ flex: "1" }}>
                        <Skeleton width="100%" className="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                      </div>
                    </div>
                  </li>
                  <li className="mb-3">
                    <div className="flex">
                      <Skeleton
                        shape="circle"
                        size="4rem"
                        className="mr-2"
                      ></Skeleton>
                      <div style={{ flex: "1" }}>
                        <Skeleton width="100%" className="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                      </div>
                    </div>
                  </li>
                  <li className="mb-3">
                    <div className="flex">
                      <Skeleton
                        shape="circle"
                        size="4rem"
                        className="mr-2"
                      ></Skeleton>
                      <div style={{ flex: "1" }}>
                        <Skeleton width="100%" className="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      <Skeleton
                        shape="circle"
                        size="4rem"
                        className="mr-2"
                      ></Skeleton>
                      <div style={{ flex: "1" }}>
                        <Skeleton width="100%" className="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {inviteQuery.data?.result?.map((notification, index) => {
            const menuItems: MenuItemType[] = [
              {
                label: "Từ chối",
                icon: "pi pi-trash",
                command: () => handleReject(notification),
              },
              {
                label: "Chấp nhận",
                icon: "pi pi-check",
                command: () => handleAccept(notification),
              },
            ];
            return (
              <Card key={index} className="notification-item ">
                <div className="notification-content ">
                  <Avatar
                    image="/public/images/avatar/waifu.jpg"
                    shape="circle"
                    size="large"
                  />
                  <div className="notification-text">
                    <h6>{notification.sendFrom}</h6>
                    <p>{notification.message}</p>
                    {/* {notification.buttonLabel && (
                  <Button
                    label={notification.buttonLabel}
                    className="p-button-outlined p-button-success"
                  />
                )} */}
                  </div>
                  <div className="menu-container">
                    {/* Add a container for the menu */}
                    <Menu
                      model={mapMenuItemTypeToMenuItem(menuItems)}
                      popup
                      ref={(el) => (menuRefs.current[index] = el)}
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
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationList;
