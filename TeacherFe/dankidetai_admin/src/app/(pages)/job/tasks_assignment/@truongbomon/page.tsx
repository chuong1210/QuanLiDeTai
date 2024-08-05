'use client'
import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { Dropdown, Editor, InputDate, InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { toast } from 'react-toastify';

const schema = yup.object({
    nameJob: yup.string().required(),
    nameTeacher: yup.string().required(),
    details: yup.string(),
    taskEnd: yup.date().required(),
})

export default function Page() {
    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),

    });

    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['list-Teacher'],
        queryFn: async () => {
            const response: any = await request.get<TeacherType[]>(API.teachers.getAllNoParams);
            console.log(response.data.result)
            return response.data.result || [];
        },
    });


    const onSubmit = (data: any) => {
        toast.success("Cập nhật thành công");
        console.log(data)
    };

    const close = () => {
        reset();
    };


    return (
        null
    )
}
