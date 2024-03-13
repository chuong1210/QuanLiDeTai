"use client"
import ROUTER from '@/assets/configs/routers'
import { cookies } from '@/assets/helpers'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function PagePage() {
    const router = useRouter()
    useEffect(() => {
        cookies.logOut()
        router.push(ROUTER.auth.login)
    }, [])
    return (<>
        admin
    </>
    )
}
