import React from 'react';

interface MenuItemType {
    parent?: string;
    code?: string;
    label?: string;
    items?: MenuItemType[];
    icon?: React.JSX.Element |string;
    to?: string;
    itemClassName?: string;
    labelClassName?: string;
    iconClassName?: string;
    permission?: string;
    checkPermission?: boolean;
    onItemClick?: (_item: MenuItemType) => void;
    onSubItemClick?: (_item: MenuItemType) => void;
    command?:(_item: MenuItemType) => void;
}
interface MenuItemProps {
    item: MenuItemType;
    permissions: string[];
  }

export type { MenuItemType,MenuItemProps };
