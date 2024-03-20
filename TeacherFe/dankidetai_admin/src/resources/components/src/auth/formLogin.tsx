"use client"
import { InputText, Password } from "@/resources/components/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "primereact/button";
import { ACCESS_TOKEN, ROLE_USER } from "@/assets/configs/request";
import * as cookies from "@/assets/helpers/cookies"
import { useRouter } from "next/navigation";
import { Controller, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { PrimeIcons } from "primereact/api";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { luuDuLieu } from "@/assets/helpers/localstore";
import { roleE } from "@/assets/configs/general";
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
            return axios.post("http://localhost:8888/log-in", {
                username: data.userName,
                password: data.password,
            })
        },
    });

    const onSubmit = async (data: any) => {

        signInMutation.mutate(data, {
            onSuccess(response) {
                try {
                    //console.log(response)
                    cookies.set(ACCESS_TOKEN, response.data.accessToken);
                    console.log(jwtDecode(response.data.accessToken),)
                    cookies.set(ROLE_USER, [roleE.giaovien])

                    // console.log(cookies.get(ROLE_USER))
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
                <a className='font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150'>
                    {'forgot_password'}
                </a>
            </div>

            <Button label={'sign_in'} className='w-full font-medium py-3 ' rounded={true} />
        </form>
    )
}
