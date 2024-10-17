import { MenuItemType } from "@/assets/types/menu";
import {
  FaBookJournalWhills,
  FaBoxesStacked,
  FaGroupArrowsRotate,
  FaHouseChimney,
  FaUserGroup,
} from "react-icons/fa6";
import { PERMISSION, ROUTES } from "..";

const ADMIN_MENU = (): MenuItemType[] => {
  const base: string = "http://localhost:3000";

  return [
    {
      code: "home",
      label: "Trang chủ",
      icon: <FaHouseChimney />,
      parent: "home",
      to: base + `${ROUTES.home.index}`,
      permission: "",
      checkPermission: false,
    },
    {
      code: "information",
      label: "Thông tin",
      parent: "information",
      icon: <FaBoxesStacked />,
      to: "",
      permission: PERMISSION.account.create,
      checkPermission: true,
      items: [
        {
          code: "notification",
          parent: "information",
          label: "Thông báo",
          to: `/${ROUTES.information.notification}`,
          permission: PERMISSION.group.view,
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
          to: base + `/${ROUTES.topic.register_topic}`,
          checkPermission: true,
        },
        {
          code: "group",
          parent: "topic",
          label: "Nhóm",
          to: base + `/${ROUTES.topic.group}`,
          permission: PERMISSION.group.view,
          checkPermission: true,
        },
        {
          code: "invite",
          parent: "topic",
          label: "Mời vào nhóm",
          to: base + `/${ROUTES.topic.invite}`,
          permission: PERMISSION.invite.view,
          checkPermission: true,
        },
        {
          code: "schedule",
          parent: "topic",
          label: "Lịch báo cáo",
          to: base + `/${ROUTES.topic.schedule}`,
          permission: PERMISSION.notification.view,
          checkPermission: false,
        },
      ],
    },

    {
      code: "group",
      label: "Nhóm",
      parent: "group",
      icon: <FaUserGroup />,
      permission: "",
      checkPermission: false,
      to: "",
      items: [
        {
          code: "register",
          parent: "group",
          label: "Đăng ký đề tài",
          to: base + `/${ROUTES.topic.register_topic}`,
          permission: "",
          checkPermission: false,
        },
        {
          code: "exercise",
          parent: "group",
          label: "Công việc cần hoàn thành",
          to: base + `/${ROUTES.topic.job_detail}/detail`,
          permission: PERMISSION.invite.view,
          checkPermission: false,
        },
      ],
    },
  ];
};

export { ADMIN_MENU };
