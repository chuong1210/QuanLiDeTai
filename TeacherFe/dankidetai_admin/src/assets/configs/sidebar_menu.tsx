import { MenuItemType } from '@/assets/types/menu';

import { FaArrowRightArrowLeft, FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';
import { LuLanguages } from 'react-icons/lu';
import ROUTER from './routers';

const SIDEBAR_MENU: MenuItemType[] = [
    {
        code: 'master_data',
        label: 'Master',
        parent: 'master_data',
        // icon: <FaBoxesStacked />,
        permission: '',
        checkPermission: true,
        items: [
            {
                code: 'Department',
                parent: 'master_data',
                label: 'Ngành',
                to: ROUTER.master.department,
                checkPermission: true,
            },
            {
                code: 'Subject',
                parent: 'master_data',
                label: 'Bộ môn',
                to: ROUTER.master.subject,
                checkPermission: true,
            },

        ],
    },
    {
        code: 'catechism_data',
        label: 'Giáo vụ',
        parent: 'catechism_data',
        permission: '',
        checkPermission: true,
        items: [
            {
                code: 'studentList',
                parent: 'catechism_data',
                label: 'danh sách sinh viên',
                to: ROUTER.catechism.students,
                checkPermission: true,
            },
            {
                code: 'teacherList',
                parent: 'catechism_data',
                label: 'danh sách giáo viên',
                to: ROUTER.catechism.teachers,
                checkPermission: true,
            },
        ],
    },
    {
        code: 'dean_data',
        label: 'Trưởng khoa',
        parent: 'dean_data',
        permission: '',
        checkPermission: true,
        items: [
            {
                code: 'studentList',
                parent: 'dean_data',
                label: 'Giao việc đăng kí',
                to: ROUTER.dean.giveJobForTeacher,
                checkPermission: true,
            },

        ],
    },
];

export { SIDEBAR_MENU };
