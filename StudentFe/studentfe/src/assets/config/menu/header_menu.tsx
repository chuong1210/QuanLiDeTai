import { MenuItemType } from "@/assets/types/menu";
import { ROUTES } from "../routes";
import { useRouter } from "next/router";
import { useUserStore } from "@/assets/zustand/user";

export const HEADER_ITEM = (): MenuItemType[] => {
  const { user } = useUserStore();

  return [
    {
      code: "information",
      label: "Thông tin",
      parent: "information",
      icon: "pi pi-briefcase    ",
      permission: "",
      checkPermission: true,
      itemClassName: "menu-item",
      items: [
        {
          code: "notification",
          parent: "information",
          label: "Thông báo",
          itemClassName: "menu-item",

          to: `${ROUTES.information.notification}`,
          checkPermission: true,
        },
        {
          code: "information user",
          parent: "information",
          itemClassName: "menu-item",

          label: "Hồ sơ",
          to: `${ROUTES.profile.student}/${user?.id}`,
          checkPermission: true,
        },
      ],
    },
    {
      code: "topic",
      label: "Đề tài",
      itemClassName: "menu-item",

      parent: "topic",
      icon: "pi pi-book",
      permission: "",
      checkPermission: true,
      items: [
        {
          code: "register_topic",
          parent: "topic",
          itemClassName: "menu-item",

          label: "Đăng kí đề tài",
          to: `${ROUTES.topic.register_topic}`,
          checkPermission: false,
        },

        {
          code: "schedule",
          parent: "topic",
          itemClassName: "menu-item",

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
          itemClassName: "menu-not",

          checkPermission: false,
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
};
