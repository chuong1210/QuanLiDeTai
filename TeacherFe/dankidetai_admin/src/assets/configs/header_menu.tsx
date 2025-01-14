import React from 'react';
import { MenuItemType } from '@/assets/types/menu';
import { FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';
import ROUTER from './routers';

const USER_MENU = (): MenuItemType[] => {

    return [
        {
            code: 'info',
            parent: 'info',
            to: ROUTER.information,
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

const CLASS_ROOM_MENU = (): MenuItemType[] => {
    const actionsClassRoom = [
        {
            code: 'update',
            parent: 'update',
            label: 'Chỉnh sửa',
        },
        {
            code: 'commit',
            parent: 'commit',
            label: 'Xác nhận hoàn thành',
        },
        {
            code: 'delete',
            parent: 'delete',
            label: 'Xóa yêu càu',
        },
    ];
    return actionsClassRoom
};
const TASKS_ASSIGNED = (): MenuItemType[] => {
    const actionsClassRoom = [
        {
            code: 'update',
            parent: 'update',
            label: 'Chỉnh sửa',
        }
    ];
    return actionsClassRoom
};
export default { USER_MENU, CLASS_ROOM_MENU, TASKS_ASSIGNED };
