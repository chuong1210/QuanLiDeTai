import React from 'react';
import { MenuItemType } from '@/assets/types/menu';
import { FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';
import ROUTER from './routers';

const USER_MENU = (): MenuItemType[] => {

    return [
        {
            code: 'info',
            parent: 'info',
            to: ROUTER.infomation,
            label: 'Thông tin',
            icon: <FaUser />,

        },
        {
            code: 'logout',
            parent: 'logout',
            label: 'Đăng xuất',
            icon: <FaArrowRightFromBracket />,
            to: ROUTER.auth.login,
        },
    ];
};

export default USER_MENU;
