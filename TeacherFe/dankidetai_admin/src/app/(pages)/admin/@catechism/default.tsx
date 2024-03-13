"use client"
import ROUTER from '@/assets/configs/routers';
import { cookies } from '@/assets/helpers';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react'

export default function DefaultPage() {
    const router = useRouter();
    const handleClose = () => {
        router.push(ROUTER.home)
    };
    const handleLogin = () => {
        cookies.logOut()
        router.push(ROUTER.auth.login)
    }
    const dialogFooter = (
        <div className='flex justify-content-between'>
            <Button label="Go to Login" className="p-button-text" onClick={handleLogin} />
            <Button label="Ok" className="p-button-text" onClick={handleClose} />
        </div>
    );



    return (
        <div className="access-denied-page">
            <Dialog
                header="Thông báo"
                visible={true}
                modal
                style={{ width: '400px' }}
                footer={dialogFooter}
                onHide={handleClose}
            >
                <div>
                    <p>Bạn không có quyền truy cập đường dẫn này.</p>
                    {/* <p>Vui lòng đăng nhập để tiếp tục.</p> */}
                </div>
            </Dialog>
        </div>
    );
}
