"use client"
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import FormLogin from "@/resources/components/src/auth/formLogin";
export default function Home() {
    return (
        <div className='flex align-items-center justify-content-center h-full w-full p-0'>
            <div className='flex flex-wrap shadow-2 w-full border-round-2xl overflow-hidden' >

                <div className='w-full lg:w-6 p-4 lg:p-7 bg-blue-50'>
                    <div className='pb-3'>
                    </div>
                    <div className='text-xl text-black-alpha-90 font-500 mb-3'>{'Thông báo hệ thống'}</div>
                    {/* <p className='text-black-alpha-50 line-height-3 mt-0 mb-6'>
                        Thêm lời chào khi vào hệ thống vào đây
                    </p>
                    <ul className='list-none p-0 m-0'>
                        <li className='flex align-items-start mb-4'>
                            <div>
                                <Button icon={PrimeIcons.INBOX} severity='help' />
                            </div>
                            <div className='ml-3'>
                                <span className='font-medium text-black-alpha-90'>Unlimited Inbox</span>
                                <p className='mt-2 mb-0 text-black-alpha-50 line-height-3'>
                                    Thêm mô tả ngắn về hệ thống tại đây
                                </p>
                            </div>
                        </li>
                        <li className='flex align-items-start mb-4'>
                            <div>
                                <Button icon={PrimeIcons.SHIELD} severity='help' />
                            </div>
                            <div className='ml-3'>
                                <span className='font-medium text-black-alpha-90'>Premium Security</span>
                                <p className='mt-2 mb-0 text-black-alpha-50 line-height-3'>
                                    Thêm mô tả ngắn về hệ thống tại đây
                                </p>
                            </div>
                        </li>
                        <li className='flex align-items-start'>
                            <div>
                                <Button icon={PrimeIcons.GLOBE} severity='help' />
                            </div>
                            <div className='ml-3'>
                                <span className='font-medium text-black-alpha-90'>Cloud Backups Inbox</span>
                                <p className='mt-2 mb-0 text-black-alpha-50 line-height-3'>
                                    Thêm mô tả ngắn về hệ thống tại đây
                                </p>
                            </div>
                        </li>
                    </ul> */}
                </div>
                <div className='w-full lg:w-6 p-4 lg:p-7 surface-card'>
                    <div className='flex align-items-center justify-content-center mb-7'>
                        <span className='text-2xl font-medium text-900'>{'ĐĂNG NHẬP HỆ THỐNG'}</span>
                    </div>
                    <FormLogin />
                </div>
            </div>
        </div>
    );
}
