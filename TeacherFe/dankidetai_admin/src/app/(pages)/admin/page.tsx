import { Button } from 'primereact/button'
import React from 'react'
import * as request from "@/assets/helpers/request"
import { logOut } from '@/assets/helpers/cookies'
import { useRouter } from 'next/navigation'
import ROUTER from '@/assets/configs/routers'
import Link from 'next/link'
export default function PagePage() {
    // const router = useRouter();
    // const logout = () => {
    //     logOut()
    //     router.push(ROUTER.auth.login)
    // }
    return (<>
        {/* <Button onClick={logout}>logout</Button> */}
        <Link href={ROUTER.admin.giaovu}>toi trang giao vu   </Link>
        <div >PagePage</div >
    </>
    )
}
