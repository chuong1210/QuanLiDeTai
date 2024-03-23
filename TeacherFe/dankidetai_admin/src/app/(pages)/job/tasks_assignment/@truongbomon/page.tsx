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
            const response = await request.get<TeacherType[]>(API.teachers.getAll);
            return response.data || [];
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
        <div className='p-4 bg-white'>
            <form className='mt-2 formgrid grid' onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"nameJob"}
                        control={control}
                        render={({ field, fieldState }) => <InputText
                            id={`form_data_${field.name}`}
                            value={field.value?.toString()}
                            label={"Tên nhiệm vụ"}
                            placeholder={"Tên nhiệm vụ"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}
                    />
                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"nameTeacher"}
                        control={control}
                        render={({ field, fieldState }) => <Dropdown
                            id={`form_data_${field.name}`}
                            value={field.value?.toString()}
                            options={TeacherQuery.data?.map((t) => ({ label: t.name, value: t.name }))}
                            label={"Tên giảng viên"}
                            placeholder={"Tên giảng viên"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />
                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"taskEnd"}
                        control={control}
                        render={({ field, fieldState }) => <InputDate
                            id={`form_data_${field.name}`}
                            label={"Thời gian kết thúc"}
                            placeholder={"Thời gian kết thúc"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />
                </div>

                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"details"}
                        control={control}
                        render={({ field, fieldState }) => <Editor
                            id={`form_data_${field.name}`}
                            label={"Chi tiết"}
                            placeholder={"Chi tiết"}
                            errorMessage={fieldState.error?.message}
                            value={field.value}
                            onChange={(data) => setValue(field.name, data)}
                        />}

                    />
                </div>
                <div className='flex align-items-center justify-content-end gap-2 mt-5 p-4 w-full' >
                    <Button
                        label={'cancel'}
                        icon='pi pi-undo'
                        severity='secondary'
                        onClick={(e) => {
                            e.preventDefault();
                            close();
                        }}
                    />
                    <Button label={'save'} icon='pi pi-save' />
                </div>
            </form>
        </div>
    )
}
