"use client"
import { INFO_USER } from '@/assets/configs/request'
import ROUTER from '@/assets/configs/routers'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [user, setInfo] = useState<UserLoginType | null>(null)
    const router = useRouter()

    useEffect(() => {
        const jinfo = localStorage.getItem(INFO_USER)
        if (jinfo === null) {
            return router.push(ROUTER.auth.login);
        }
        const info: UserLoginType = JSON.parse(jinfo)
        setInfo(info)
    }, [])
    return (

        user && <Card title="Thông tin người dùng">
            <div className="p-grid p-dir-col">
                <div className="p-col-12 p-md-6">
                    <div className="p-field">
                        <label>Username: </label>
                        <span>{user.username}</span>
                    </div>
                    <div className="p-field">
                        <label>Is Graduate: </label>
                        <span>{user.isGraduate === 1 ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <h5>Role Information</h5>
                    {user.roles.map((role) => (
                        <div key={role.id} className="p-field">
                            <div>
                                <label>Role Name: </label>
                                <span>{role.name}</span>
                            </div>
                            <div>
                                <label>Role Code: </label>
                                <span>{role.code}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <h5>Teacher Information</h5>
                    <div className="p-field">
                        <label>Ma So: </label>
                        <span>{user.teachers.maSo}</span>
                    </div>
                    <div className="p-field">
                        <label>Name: </label>
                        <span>{user.teachers.name}</span>
                    </div>
                    <div className="p-field">
                        <label>Hoc Vi: </label>
                        <span>{user.teachers.hocVi}</span>
                    </div>
                    <div className="p-field">
                        <label>Email: </label>
                        <span>{user.teachers.email}</span>
                    </div>
                    <div className="p-field">
                        <label>Phone Number: </label>
                        <span>{user.teachers.phoneNumber}</span>
                    </div>
                    <div className="p-field">
                        <label>Chuc Vu: </label>
                        <span>{user.teachers.chucVu}</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
