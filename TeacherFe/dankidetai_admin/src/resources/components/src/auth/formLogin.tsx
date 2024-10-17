"use client"
import { InputText, Password } from "@/resources/components/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "primereact/button";
import { ACCESS_TOKEN, INFO_USER, REFERSH_TOKEN, ROLE_USER } from "@/assets/configs/request";
import * as cookies from "@/assets/helpers/cookies"
import { useRouter } from "next/navigation";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { roleE } from "@/assets/configs/general";
import Link from "next/link";
import ROUTER from "@/assets/configs/routers";
import { splitString } from "@/assets/helpers/string";
import { jwtDecode } from "jwt-decode"

import * as request from "@/assets/helpers/request"
const schema = () =>
    yup.object({
        userName: yup.string().required('validation:required'),
        password: yup.string().required('validation:required'),
        remember_password: yup.boolean(),
    });


export default function FormLogin() {
    const router = useRouter()

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema()),
        defaultValues: {
            userName: "",
            password: ""
        }
    });
    const signInMutation = useMutation({
        mutationFn: (data: any) => {
            return axios.post("http://localhost:8888/auth/log-in", {
                username: data.userName,
                password: data.password,
            })
        },
    });
    // const getInfoMutation = useMutation({
    //     mutationFn: (userName: string) => {
    //         return 
    //     },
    // });


    const onSubmit = async (data: any) => {
        signInMutation.mutate(data, {
            async onSuccess(response) {
                try {
                    const decoded: any = jwtDecode(response.data.result.accessToken);
                    const arr = decoded.scope.split(" ");
                    cookies.set(ACCESS_TOKEN, response.data.result.accessToken, { expires: new Date(decoded.exp * 1000 + 500 * 1000) })
                    //cookies.set(REFERSH_TOKEN, response.data.result.refreshToken)
                    cookies.set(ROLE_USER, arr, { expires: new Date(decoded.exp * 1000) })
                    //response.data.result.allRoles
                    // const res: any = await request.get("http://localhost:8888/users/getMyInfo", {
                    //     headers:{
                    //         auth
                    //     },
                    //     params: { userName: decoded.username }
                    // })
                    const res: any = await request.get("/users/getMyInfo")
                    const info: UserLoginType = res.data.result
                    // console.log(info)
                    localStorage.setItem(INFO_USER, JSON.stringify(info))
                    return router.push("/admin");
                } catch (error) {
                    console.log('🚀 ~ file: page.tsx:70 ~ onSuccess ~ error:', error);
                }
            },
        })
    }
    return (
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
                <Link href={ROUTER.auth.forgotPassword} className='font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150'>
                    {'forgot_password'}
                </Link>
            </div>

            <Button label={'sign_in'} className='w-full font-medium py-3 ' rounded={true} />
        </form>
    )
}
