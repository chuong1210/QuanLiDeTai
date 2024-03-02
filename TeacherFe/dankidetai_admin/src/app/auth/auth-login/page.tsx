"use client"
import { InputText, Password } from "@/resources/components/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "primereact/button";
import { ACCESS_TOKEN } from "@/assets/configs/request";
import * as cookies from "@/assets/helpers/cookies"
import { useRouter } from "next/navigation";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { PrimeIcons } from "primereact/api";
import ROUTER from "@/assets/configs/routers";
const schema = () =>
    yup.object({
        userName: yup.string().required('validation:required'),
        password: yup.string().required('validation:required'),
        remember_password: yup.boolean(),
    });

export default function Home() {
    const { control, handleSubmit } = useForm({ resolver: yupResolver(schema()) });
    const router = useRouter();
    const signInMutation = useMutation({
        mutationFn: (data: any) => {
            console.log(data)
            // return request.post("/log-in", {
            //   username: data.userName,
            //   password: data.password,
            // });
            return axios.post("http://localhost:8888/log-in", {
                username: data.userName,
                password: data.password,
            })
        },
    });

    const onSubmit = (data: any) => {
        signInMutation.mutate(data, {
            onSuccess(response) {
                try {
                    console.log("/// checkk res", response);
                    cookies.set(ACCESS_TOKEN, response.data.accessToken);

                    router.push(ROUTER.home);
                } catch (error) {
                    console.log('🚀 ~ file: page.tsx:70 ~ onSuccess ~ error:', error);
                }
            },
        });
    };

    return (
        <div className='flex align-items-center justify-content-center h-full w-full p-0'>
            <div className='flex flex-wrap shadow-2 w-full border-round-2xl overflow-hidden'>

                <div className='w-full lg:w-6 p-4 lg:p-7 bg-blue-50'>
                    <div className='pb-3'>
                    </div>
                    <div className='text-xl text-black-alpha-90 font-500 mb-3'>{'welcome_to_system'}</div>
                    <p className='text-black-alpha-50 line-height-3 mt-0 mb-6'>
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
                    </ul>
                </div>

                <div className='w-full lg:w-6 p-4 lg:p-7 surface-card'>
                    <div className='flex align-items-center justify-content-center mb-7'>
                        <span className='text-2xl font-medium text-900'>{'sign_in_to_continue'}</span>

                    </div>
                    <form className='flex flex-column gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name='userName'
                            control={control}
                            render={({ field, formState }) => (
                                <InputText
                                    id='account'
                                    value={field.value}
                                    label={'account'}
                                    placeholder={'account'}
                                    errorMessage={formState.errors.userName?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />

                        <Controller
                            name='password'
                            control={control}
                            render={({ field, formState }) => (
                                <Password
                                    id='password'
                                    value={field.value}
                                    label={'password'}
                                    placeholder={'password'}
                                    errorMessage={formState.errors.password?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                        <div className='flex align-items-center justify-content-between'>
                            <div>
                                {signInMutation.isError && (
                                    <small className='p-error'>{'Login Fail'}</small>
                                )}
                            </div>
                            <a className='font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150'>
                                {'forgot_password'}
                            </a>
                        </div>

                        <Button label={'sign_in'} className='w-full font-medium py-3 ' rounded={true} />
                    </form>
                </div>
            </div>
        </div>
    );
}
