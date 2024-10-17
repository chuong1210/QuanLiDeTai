"use client"

import { FormRefType, FormType } from '@/assets/types/form';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { Checkbox, Dropdown, Editor, InputDate, InputNumber, InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { toast } from 'react-toastify';
import { dateToString, getDateNow } from '@/assets/helpers/string';
import { cookies } from '@/assets/helpers';
import { ACCESS_TOKEN } from '@/assets/configs/request';
import { jwtDecode } from 'jwt-decode';
import { MultiSelect } from '@/resources/components/form/MultiSelect';
const schema = yup.object({
    from: yup.date().required(),
    due: yup.date().required(),
    name: yup.string().required(),
    description: yup.string(),
    detail: yup.string(),
    quantityRequirement: yup.number().required(),
    teacherIds: yup.array().required()
})


const Page = () => {
    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),

    });

    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['list-Teacher'],
        queryFn: async () => {
            const response: any = await request.get<TeacherType[]>(API.teachers.getAllNoParams);
            console.log(response)
            return response.data.result || [];
        },
    });
    const JobAssignment = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data) => {
            return request.post<any>(API.job.InsertJobForTeacher, data);
        },
    });


    const onSubmit = (data: any) => {
        try {

            JobAssignment.mutate(data, {
                onSuccess: (response) => {
                    close();
                    toast.success("Lưu mới thành công");
                },
            })
        } catch (error: any) {
            toast.error(error)
        }

    };




    return (

        <div className='p-4 bg-white h-full'>
            <form className='relative mt-2 h-auto  formgrid grid' style={{ minHeight: "50vh", maxWidth: "100vw" }} onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"name"}
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
                        name={"teacherIds"}
                        control={control}
                        render={({ field, fieldState }) => <MultiSelect
                            id='teacherIds'
                            options={TeacherQuery.data?.map((t) => ({ label: t.name + " - " + t.code, value: t.id }))}
                            value={field.value && Array.isArray(field.value) ? field.value : undefined}
                            label={"Giảng viên nhận nhiệm vụ"}
                            placeholder={"Giảng viên nhận nhiệm vụ"}
                            errorMessage={fieldState.error?.message}
                            onChange={(e) => {
                                field.onChange(e)
                            }}
                        />
                        }

                    />
                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"from"}
                        control={control}
                        render={({ field, fieldState }) => <InputDate
                            id={`form_data_${field.name}`}
                            label={"Thời gian bắt đầu"}
                            placeholder={"Thời gian bắt đầu"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />

                </div>

                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"due"}
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
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={'quantityRequirement'}
                        control={control}
                        render={({ field, fieldState }) => <InputNumber
                            id={`form_data_${field.name}`}
                            label={"Số lượng yêu cầu"}
                            placeholder={"Số lượng yêu cầu"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />

                </div>
                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"description"}
                        control={control}
                        render={({ field, fieldState }) => <Editor
                            id={`form_data_${field.name}`}
                            label={"Mô tả"}
                            placeholder={"Mô tả"}
                            errorMessage={fieldState.error?.message}
                            value={field.value}
                            onChange={(data) => setValue(field.name, data)}
                        />}

                    />
                </div>
                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"detail"}
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

                <div style={{ bottom: "0", right: '0', position: 'fixed' }} className=' botton-0 flex align-items-center justify-content-end gap-2 mt-5 p-4 w-full' >
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
// Page.displayName = `forwardRefInSert`
export default Page
