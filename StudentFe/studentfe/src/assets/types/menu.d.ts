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
    permission?: any;
    checkPermission?: boolean;
    onItemClick?: (_item: MenuItemType) => void;
    onSubItemClick?: (_item: MenuItemType) => void;
    command?:(_item: MenuItemType) => void;
    separator?:boolean
    key?:string;
    description?: string; // Add a description field
}
interface MenuItemProps {
    item: MenuItemType;
    permissions: any[];
  }

export type { MenuItemType,MenuItemProps };
