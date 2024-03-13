"use client"
import ROUTER from '@/assets/configs/routers'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push(ROUTER.home)
  }, [])
  return (
    <>
    </>
  )
}
