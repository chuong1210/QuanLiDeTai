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
import { useUser } from "@/assets/context/UserContext";
import { toast } from "react-toastify";
import { useUserStore } from "@/assets/zustand/user";
import { ms } from "date-fns/locale";
import { NotificationItem } from "@/resources/components/UI";

const NotificationList = () => {
  const { user, hasGroup, setUser, setHasGroup } = useUserStore();
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
      setTimeout(() => {}, 300);
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
    setIsLoading(true);

    const updatedNotification: InviteType = {
      // ...notification,
      id: notification.id,
      statusInvitation: "AOS",
    };
    recallInviteMutate.mutate(updatedNotification);
    if (recallInviteMutate.isSuccess) {
      setHasGroup(true);
      toast.success("Chấp nhận lời mời thành công");
      inviteQuery.refetch();
    }
  };

  const handleReject = (notification: InviteType) => {
    setIsLoading(true);
    // Tạo một bản sao của notification và cập nhật status
    const updatedNotification: InviteType = {
      // ...notification,
      id: notification.id,
      statusInvitation: "RE",
    };
    recallInviteMutate.mutate(updatedNotification);
    if (recallInviteMutate.isSuccess) {
      localStorage.removeItem("hasGroup");
      localStorage.setItem("hasGroup", JSON.stringify(false));

      inviteQuery.refetch();
    }
  };

  const handleMenuToggle = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (menuRefs.current[index]) {
      menuRefs.current[index]?.toggle(event); // This should open the menu
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
          <div className="flex justify-content-center mt-2  h-3rem max-h-10rem mb-0  ">
            <p className="p-1 font-semibold text-xl ">Danh sách lời mời</p>
            <i
              className="pi pi-arrow-circle-down ml-2 "
              style={{ fontSize: "2rem", cursor: "pointer" }}
              onClick={() => setIsExpanded(!isExpanded)}
            ></i>
          </div>
        }
        // content={

        // }
        className="h-3rem max-h-10rem max-h-0 mb-0 "
      />
      <Divider />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isExpanded ? "visible" : "hidden"}
        className="notifications-list"
      >
        {inviteQuery.data?.result && inviteQuery.data.result.length > 0 ? (
          <h5 className="notification-dialogue ml-3 mb-0">
            Tất cả lời mời của bạn:
          </h5>
        ) : (
          <h5 className="notification-dialogue ml-3">
            Bạn chưa có lời mời nào.
          </h5>
        )}
        <div className="notifications-list mb-8">
          {inviteQuery.isLoading && (
            <div className="card ">
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
          {inviteQuery.data?.result?.map((notification, index) => (
            <NotificationItem
              key={index}
              notification={notification}
              index={index}
              onAccept={handleAccept}
              onReject={handleReject}
              menuRef={menuRefs}
              handleMenuToggle={handleMenuToggle}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationList;
