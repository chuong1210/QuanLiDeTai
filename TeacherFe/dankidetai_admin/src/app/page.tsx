import ROUTER from '@/assets/configs/routers'
import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <>
      <Link href={ROUTER.auth.login}>Login</Link>
      <Link href={"/admin"}>admin</Link>
      <div>Home</div>
    </>
  )
}
