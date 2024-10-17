"use client";

import { ROUTES } from "@/assets/config";
import { cookies } from "@/assets/helpers";
import { useDispatch } from "@/assets/redux-toolkit";
import menuSlice from "@/assets/redux-toolkit/slices/menu/slice";
import { MenuItemProps, MenuItemType } from "@/assets/types/menu";
import { MenuSliceType } from "@/assets/types/slice";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import qs from "query-string";
import { useState } from "react";
// const userPermissions = {
//   view: ['Faculty.View', 'Student.View'],
//   create: ['Student.Create', 'Group.Create'],
//   // ... NÀY LÀ BACKEND TRẢ VỀ
// };
// const checkPermission = (requiredPermission, userPermissions) => {
//   return userPermissions.includes(requiredPermission);
// };

// const { code, permission } = item;

//   const hasPermission = permission ? checkPermission(permission, permissions.view) : true;
const MenuItem = ({ item, permissions }: MenuItemProps) => {
  const {
    parent,
    code,
    icon,
    items,
    label,
    labelClassName,
    iconClassName,
    itemClassName,
    onItemClick,
    permission,
    checkPermission,
  } = item;

  const Icon = () => icon;
  const dispatch = useDispatch();
  const params = useSearchParams();
  const active =
    code === params?.get("activeItem") || code === params?.get("parent");
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const router = useRouter();
  const checkChildPermission = cookies.checkChildPermission(item, permissions);

  const onClick = (currItem: MenuItemType) => {
    if (!params) return;
    let activeMenu: MenuSliceType = {
      activeItem: code,
      parent,
      openMenu: false,
    };

    if (items && items.length > 0) {
      if (active) {
        activeMenu = {
          activeItem: "",
          parent: "",
          openMenu: isOpenMenu && JSON.parse(params.get("openMenu") || "false"),
        };

        setIsOpenMenu(false);
      } else {
        activeMenu = {
          activeItem: code,
          parent,
          openMenu: isOpenMenu && JSON.parse(params.get("openMenu") || "false"),
        };

        setIsOpenMenu(true);
      }
    } else if (parent) {
      activeMenu = {
        activeItem: code,
        parent,
        openMenu: false,
      };
    } else {
      setIsOpenMenu(false);
    }

    onItemClick?.(currItem);

    dispatch(menuSlice.actions.onItemClick(activeMenu));

    // if (currItem.to) {
    //   router.push(currItem.to + "?" + qs.stringify(activeMenu));
    // } else {
    //   router.push("?" + qs.stringify(activeMenu));
    // }
    // tu them
    if (currItem.to) {
      router.push(`${currItem.to}`);
    } else {
      router.push("?" + qs.stringify(activeMenu));
    }
  };

  const SubItem = () => {
    return items?.map((child) => (
      <MenuItem
        key={child.label}
        item={{ ...child, itemClassName: "childBody" }}
        permissions={permissions}
      />
    ));
  };

  return (
    <div className="my-2">
      {(!checkPermission ||
        code === "home" ||
        cookies.checkPermission(permission || "", permissions) ||
        (items &&
          items.length > 0 &&
          checkChildPermission &&
          typeof permission !== "undefined")) && (
        <div
          className={classNames(
            "flex align-items-center gap-2 h-3rem px-3 no-underline cursor-pointer transition-linear transition-duration-200 border-round-3xl p-ripple",
            itemClassName,
            {
              "hover:bg-blue-200": !active,
              "text-900": !active,
              "bg-white": !active,
              "bg-primary": active,
              "p-highlight": active,
            }
          )}
          onClick={() => onClick(item)}
        >
          {icon && (
            <div className={classNames("p-1", iconClassName)}>
              <Icon />
            </div>
          )}

          <p
            className={classNames(
              "flex-1 text-sm font-semibold itemLabel m-0",
              labelClassName
            )}
          >
            {label}
          </p>

          {items && items.length > 0 && (
            //  && checkChildPermission &&
            <i className="pi pi-chevron-down text-sm" />
          )}

          <Ripple />
        </div>
      )}

      {items && items.length && (
        <motion.div
          animate={
            (isOpenMenu && active) ||
            (isOpenMenu && JSON.parse(params?.get("openMenu") || "false")) ||
            parent === params?.get("parent")
              ? { height: "auto" }
              : { height: 0 }
          }
          transition={{ duration: 0.3 }}
          className={classNames(
            "overflow-hidden border-left-1 border-300 subMenu mt-1"
          )}
        >
          <SubItem />
        </motion.div>
      )}
    </div>
  );
};

export default MenuItem;
