'use client';

import { cookies } from '@/assets/helpers';
import { MenuItemType } from '@/assets/types/menu';
import { MenuSliceType } from '@/assets/types/slice';
import { current } from '@reduxjs/toolkit';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRouter as useRT } from 'next/router';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import qs from 'query-string';
import { useState } from 'react';

interface MenuItemProps {
    item: MenuItemType;
}

const MenuItem = ({ item }: MenuItemProps) => {
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
        checkPermission,
    } = item;

    const pathname = usePathname()
    //const searchParams = useSearchParams()
    const Icon = () => icon;
    //const params = useSearchParams();
    //const [active,setActive]=useState(false)
    const active = item.to ? item.to === pathname : false
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const router = useRouter();

    const onClick = (currItem: MenuItemType) => {
        //console.log("path", pathname, "param", params)
        if (items && items.length > 0) {
            if (isOpenMenu) {
                setIsOpenMenu(false)
            } else {
                setIsOpenMenu(true);
            }
        }
        onItemClick?.(currItem);
        if (currItem.to) {
            return router.push(currItem.to)
        }
    };

    const SubItem = () => {
        return items?.map((child, index) => (<div key={index} style={{ marginLeft: "12px" }}>
            <MenuItem key={child.label} item={{ ...child }} />
        </div>
        ));
    };

    return (
        <div className='my-1'>
            <div
                className={classNames(
                    'flex align-items-center gap-2 h-3rem px-3 no-underline cursor-pointer transition-linear transition-duration-200 p-ripple',
                    itemClassName,
                    {
                        'hover:bg-blue-100': !isOpenMenu,
                        'text-900': !isOpenMenu,
                        'bg-primary': isOpenMenu || active,
                        'p-highlight': isOpenMenu || active,
                    },
                )}
                onClick={() => onClick(item)}
            >
                {icon && (
                    <div className={classNames('p-1', iconClassName)}>
                        <Icon />
                    </div>
                )}
                <p className={classNames('flex-1 text-sm font-semibold itemLabel m-0', labelClassName)}>{label}</p>

                {items && items.length > 0 && <i className='pi pi-chevron-down text-sm' ></i>}

                <Ripple />
            </div>


            {items && items.length > 0 && (
                <motion.div
                    animate={
                        isOpenMenu
                            ? { height: 'auto' }
                            : { height: 0 }
                    }
                    transition={{ duration: 0.3 }}
                    className={classNames('overflow-hidden border-left-1 border-300 subMenu mt-1')}
                >
                    <SubItem />
                </motion.div>
            )}
        </div>
    );
};

export default MenuItem;
