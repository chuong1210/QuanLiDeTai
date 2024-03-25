import { MenuItemType } from "@/assets/types/menu";
import {
  FaBookJournalWhills,
  FaBoxesStacked,
  FaHouseChimney,
} from "react-icons/fa6";
import { PERMISSION, ROUTES } from "..";

const ADMIN_MENU = (): MenuItemType[] => {
  return [
    {
      code: "home",
      label: "Trang chủ",
      icon: <FaHouseChimney />,
      parent: "home",
      to: `/${ROUTES.home.index}`,
      permission: "",
      checkPermission: true,
    },
    {
      code: "information",
      label: "Thông tin",
      parent: "information",
      icon: <FaBoxesStacked />,
      to: "",
      permission: "",
      checkPermission: true,
      items: [
        {
          code: "notification",
          parent: "information",
          label: "Thông báo",
          to: `/${ROUTES.information.notification}`,
          permission: PERMISSION.notification.view,
          checkPermission: true,
        },
      ],
    },
    {
      code: "topic",
      label: "Đề tài",
      parent: "topic",
      icon: <FaBookJournalWhills />,
      permission: "",
      checkPermission: true,
      to: "",
      items: [
        {
          code: "register_topic",
          parent: "topic",
          label: "Đăng kí đề tài",
          to: `/${ROUTES.topic.register_topic}`,
          checkPermission: false,
        },
        {
          code: "group",
          parent: "topic",
          label: "Nhóm",
          to: `/${ROUTES.topic.group}`,
          permission: PERMISSION.group.view,
          checkPermission: true,
        },
        {
          code: "invite",
          parent: "topic",
          label: "Mời vào nhóm",
          to: `/${ROUTES.topic.invite}`,
          permission: PERMISSION.invite.view,
          checkPermission: true,
        },
        {
          code: "schedule",
          parent: "topic",
          label: "Lịch báo cáo",
          to: `/${ROUTES.topic.schedule}`,
          // permission: PERMISSION.schedule.view,
          checkPermission: false,
        },
      ],
    },
  ];
};

export { ADMIN_MENU };
