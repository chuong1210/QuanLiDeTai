import { MenuItemType } from "@/assets/types/menu";
import { ROUTES } from "../routes";
import { useRouter } from "next/router";
export const headerItems: MenuItemType[] = [
  {
    code: "information",
    label: "Thông tin",
    parent: "information",
    icon: "pi pi-briefcase    ",
    permission: "",
    checkPermission: true,
    items: [
      {
        code: "notification",
        parent: "information",
        label: "Thông báo",
        to: `${ROUTES.information.notification}`,
        checkPermission: true,
      },
      {
        code: "information user",
        parent: "information",
        label: "Thông tin người dùng",
        to: `${ROUTES.profile.student}`,
        checkPermission: true,
      },
    ],
  },
  {
    code: "topic",
    label: "Đề tài",
    parent: "topic",
    icon: "pi pi-book",
    permission: "",
    checkPermission: true,
    items: [
      {
        code: "register_topic",
        parent: "topic",
        label: "Đăng kí đề tài",
        to: `${ROUTES.topic.register_topic}`,
        checkPermission: false,
      },

      {
        code: "schedule",
        parent: "topic",
        label: "Lịch báo cáo",
        to: `${ROUTES.topic.schedule}`,
        checkPermission: false,
      },
      {
        separator: true,
      },
      {
        code: "group",
        parent: "topic",
        label: "Nhóm",
        checkPermission: true,
        items: [
          {
            to: `${ROUTES.topic.job_detail}`,
            code: "group",
            parent: "topic",
            label: "Công việc",
            checkPermission: true,
          },
          {
            to: `${ROUTES.topic.group}`,
            code: "group",
            parent: "topic",
            label: "Xem nhóm",
            checkPermission: true,
          },
          {
            code: "invite",
            parent: "topic",
            label: "Mời vào nhóm",
            to: `${ROUTES.topic.invite}`,
            checkPermission: true,
          },
        ],
      },
    ],
  },
];
