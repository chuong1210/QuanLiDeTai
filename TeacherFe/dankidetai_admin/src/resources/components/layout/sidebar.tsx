import React from 'react'
import MenuItem from '../UI/MenuItem'
import ROUTER from '@/assets/configs/routers'
import Image from 'next/image'
import LogoImage from "@/resources/image/huit/logo.png"
import Link from 'next/link'
import { SIDEBAR_MENU } from '@/assets/configs/sidebar_menu'

export default function Sidebar() {
    return (
        <div
            className='relative' style={{ zIndex: 100, minWidth: "20vw" }}
        >
            <div className='fixed flex flex-column gap-2  bg-white h-screen  shadow-2 p-4' style={{ zIndex: 100, minWidth: "20vw" }}>
                <div className='flex justify-content-center'>
                    <Link href={ROUTER.home}>
                        <Image src={LogoImage} alt='' width={100} height={100} priority={true} />
                    </Link>
                </div>
                <h2 className='text-center'>Giáo viên</h2>

                <ul className='p-2 overflow-y-auto h-full'>
                    {SIDEBAR_MENU.map((item) => <MenuItem key={item.code} item={item} />)}
                </ul>
            </div>
        </div>
    )
}
