"use client"
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { cookies } from '../helpers'
import { ACCESS_TOKEN } from '../configs/request'
import ROUTER from '../configs/routers'

// function getUserStatus(token) {
//     if (token === 'admin') {
//         return 'admin'
//     } else if (token === 'user') {
//         return 'user'
//     } else {
//         return 'guest'
//     }
// }

// function getRequiredStatus(pathname) {
//     if (pathname === '/admin') {
//         return 'admin'
//     } else if (pathname === '/profile') {
//         return 'user'
//     } else {
//         return 'guest'
//     }
// }

export default function AuthRouter({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    function checkAuth() {
        const token = cookies.get(ACCESS_TOKEN);
        if (!token) {
            return router.push(ROUTER.auth.login)
        }
    }
    useEffect(() => {
        checkAuth()
    }, [pathname, searchParams])

    return <>{children}</>
}