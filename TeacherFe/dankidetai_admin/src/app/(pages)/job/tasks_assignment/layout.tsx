"use client"
import { roleE } from '@/assets/configs/general';
import { ROLE_USER } from '@/assets/configs/request';
import { cookies } from '@/assets/helpers';
import React, { ReactNode } from 'react'

export default function Layout(
    { children, admin, giaovu, giaovien, truongkhoa, truongbomon }:
        {
            children: ReactNode, admin: ReactNode,
            giaovu: ReactNode, giaovien: ReactNode,
            truongkhoa: ReactNode, truongbomon: ReactNode
        }) {
    // const roles = useSelector((state: Rootstate) => state.role.role);

    const element = (role?: roleE) => {
        switch (role) {
            case roleE.admin: return [admin, truongkhoa, truongbomon, giaovu, giaovien];
            case roleE.truongkhoa: return truongkhoa;
            case roleE.giaovu: return giaovu;
            case roleE.giaovien: return giaovien;
            case roleE.truongbomon: return truongbomon;
            default: return children
        }
    }
    return (
        <div>{cookies.get<roleE[]>(ROLE_USER)?.map((role) => element(role))}{children}</div>
    )
}
