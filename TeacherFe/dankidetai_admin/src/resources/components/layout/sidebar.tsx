import React from 'react'
import MenuItem from '../UI/MenuItem'
import ROUTER from '@/assets/configs/routers'
import Image from 'next/image'
import LogoImage from "@/resources/image/huit/logo.png"
import Link from 'next/link'
const data = [
    {
        code: 'master_data',
        label: 'cột 1',
        parent: 'master_data',
        // icon: <FaBoxesStacked />,
        permission: '',
        checkPermission: true,
        items: [
            {
                code: 'teacher',
                parent: 'master_data',
                label: 'cột con cột 1 1',
                to: `/to`,
                //permission: PERMISSION.teacher.view,
                checkPermission: true,
            },
            {
                code: 'student',
                parent: 'master_data',
                label: 'GiaoVu',
                to: ROUTER.admin.giaovu,
                // permission: PERMISSION.student.view,
                checkPermission: true,
            },

        ],
    },
    {
        code: 'thesis',
        label: 'cột 2',
        parent: 'thesis',
        permission: '',
        checkPermission: true,
        items: [
            {
                code: 'topic',
                parent: 'thesis',
                label: 'menu:topic',
                permission: '',
                checkPermission: true,
                items: [
                    {
                        code: 'teacher',
                        parent: 'master_data',
                        label: 'cột con cột 1 1',
                        to: `/to`,
                        //permission: PERMISSION.teacher.view,
                        checkPermission: true,
                    }, {
                        code: 'teacher',
                        parent: 'master_data',
                        label: 'cột con cột 1 1',
                        to: `/to`,
                        //permission: PERMISSION.teacher.view,
                        checkPermission: true,
                    },
                ]
            },
            {
                code: 'group',
                parent: 'thesis',
                label: 'menu:group',
                checkPermission: true,
            },
            {
                code: 'schedule',
                parent: 'thesis',
                label: 'menu:schedule',
                checkPermission: true,
            },
            {
                code: 'point',
                parent: 'thesis',
                label: 'menu:point',
                checkPermission: true,

            },
            {
                code: 'job',
                parent: 'thesis',
                label: 'menu:job',
                checkPermission: true,
            },

        ],
    },
]
export default function Sidebar() {
    return (
        <div
            className='flex flex-column gap-2 bg-white h-screen relative shadow-2 p-4'
            style={{ zIndex: 1000, minWidth: '19rem' }}
        >
            <div className='flex justify-content-center'>
                <Link href={ROUTER.home}>
                    <Image src={LogoImage} alt='' width={100} height={100} priority={true} />
                </Link>
            </div>
            <h2 className='text-center'>Giáo viên</h2>

            <ul className='p-2 overflow-y-auto h-full'>
                {data.map((item) => <MenuItem key={item.code} item={item} />)}
            </ul>
        </div>
    )
}
