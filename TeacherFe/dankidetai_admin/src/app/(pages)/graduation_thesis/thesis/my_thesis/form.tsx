"use client"
import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { Dropdown, Editor, InputDate, InputNumber, InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from "@tanstack/react-query";

import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { toast } from 'react-toastify';
import { MultiSelect } from '@/resources/components/form/MultiSelect';
import { FormRefType, FormType } from '@/assets/types/form';
import { Dialog } from 'primereact/dialog';

const schema = yup.object({
    name: yup.string().required(),
    minMembers: yup.number().required().min(1),
    maxMembers: yup.number().required().moreThan(yup.ref("minMembers")),
    subjectsID: yup.array().required(),
    gvhd: yup.array().required(),
    students: yup.array().test('check-students', 'Invalid number of students', function (value) {
        const { minMembers, maxMembers } = this.parent;
        //return //!value || (value.length >= minMembers && value.length <= maxMembers);
        if (value && value?.length > 0) {
            return (value.length >= minMembers && value.length <= maxMembers);
        } else { return true }
    }),
    detail: yup.string().required(),
})


const Form = forwardRef<FormRefType<ReSearchType>, FormType<ReSearchType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        //defaultValues: defaultValues

    });
    const TeacherMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (dataa) => {
            //console.log(dataa)
            if (type === "edit") {
                return request.update(API.reSearch.update + `/${data?.id}`, dataa)
            } else {
                return request.post(API.reSearch.insert, dataa)
            }
        },
    });
    const StudentListQuery = useQuery<StudentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,

        queryKey: ['list-Students'],
        queryFn: async () => {

            const response: any = await request.get<StudentType[]>(`${API.students.getAllNoParams}`);
            // //console.log("student list", response)
            let responseData = response.data ?? [];
            //console.log("  queryKey: ['list-Students'],", responseData.result)
            return responseData.result || [];
        },
    });

    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['list-Teacher'],
        queryFn: async () => {
            const response: any = await request.get<TeacherType[]>(API.teachers.getAllNoParams);
            //console.log(response.data.result)
            return response.data.result || [];
        },
    });

    const SubjectsQuery = useQuery<SubjectType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['list-Subjects'],
        queryFn: async () => {
            const response: any = await request.get<SubjectType[]>(API.subjects.getAllNoParams);
            let responseData = response.data.result.responses ?? [];

            // //console.log("subject list", response)
            return response.data.result || [];
        },
    })
    const show = (data?: ReSearchType) => {
        setVisible(true);
        if (data) {
            const valueReset: {
                students?: any[] | undefined;
                name: string;
                minMembers: number;
                maxMembers: number;
                subjectsID: any[];
                gvhd: any[];
                detail: string;
            } = {
                //students:[data]
                name: data.name,
                minMembers: data.minMembers,
                maxMembers: data.maxMembers,
                subjectsID: data.subjects.map(item => item.id),
                gvhd: data.teachers.map(item => item.id),
                detail: data.detail
            }
            reset(valueReset);
        } else {
            // reset(defaultValues);

        }
        SubjectsQuery.refetch()
        StudentListQuery.refetch()
        TeacherQuery.refetch()

    };


    const onSubmit = (data: {
        students?: string[] | undefined;
        detail: string;
        name: string;
        minMembers: number;
        maxMembers: number;
        subjectsID: string[];
        gvhd: string[];
    }) => {
        const datareq = {
            ...data,
            gvhd: data.gvhd[0],
            namHoc: "2023-2024",
            dotDangKy: "1",
            isApproved: "0",
            gvpb: data.gvhd[1],//temp

            // hih
            maDeTai: "",
            oldDetail: "",
            notes: "",

        }
        //console.log(datareq)
        TeacherMutation.mutate(datareq, {
            onSuccess: (response: any) => {
                close();
                onSuccess?.(response.data);
                toast.success("Tạo thành công");

            },
        })

    };

    const close = () => {
        setVisible(false);
        reset();
    };

    useImperativeHandle(ref, () => ({
        show,
        close
    }));


    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '90vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            <form className='mt-2 formgrid grid' onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"name"}
                        control={control}
                        render={({ field, fieldState }) => <InputText
                            id={`form_data_${field.name}`}
                            value={field.value?.toString()}
                            label={"Tên đề tài"}
                            placeholder={"Tên đề tài"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}
                    />
                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"subjectsID"}
                        control={control}
                        render={({ field, fieldState }) => <MultiSelect
                            id={`form_data_${field.name}`}
                            value={field.value ? field.value : undefined}
                            options={SubjectsQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                            label={"Chuyên ngành yêu cầu"}
                            placeholder={"Chuyên ngành yêu cầu"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />
                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={'gvhd'}
                        control={control}
                        render={({ field, fieldState }) => <MultiSelect
                            id={`form_data_${field.name}`}
                            value={field.value ? field.value : undefined}
                            options={TeacherQuery.data?.map((t) => ({ label: `${t.name},msgv:${t.maSo}`, value: t.id }))}
                            label={"Giảng viên phụ trợ"}
                            placeholder={"Giảng viên phụ trợ"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />
                </div>
                <div className='col-2 flex flex-column gap-3 mb-2 mr-6'>
                    <Controller
                        name={'minMembers'}
                        control={control}
                        render={({ field, fieldState }) => <InputNumber
                            id={`form_data_${field.name}`}
                            value={field.value}
                            label={"Số lượng tối thiểu"}
                            placeholder={"Số lượng tối thiểu"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}
                    />
                </div>
                <div className='col-2 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={'maxMembers'}
                        control={control}
                        render={({ field, fieldState }) => <InputNumber
                            id={`form_data_${field.name}`}
                            value={field.value}
                            label={"Số lượng tối đa"}
                            placeholder={"Số lượng tối đa"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}
                    />
                </div>

                <div className='col-9 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"students"}
                        control={control}
                        render={({ field, fieldState }) => <MultiSelect
                            id={`form_data_${field.name}`}
                            label={"Chọn sinh viên cho đề tài"}
                            placeholder={"Chọn sinh viên cho đề tài"}
                            options={StudentListQuery.data?.map((t) => ({ label: `${t.name},mssv:${t.maSo}`, value: t.id }))}
                            errorMessage={fieldState.error?.message}
                            value={field.value}
                            onChange={field.onChange}
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
        </Dialog>
    )
})
Form.displayName = `forwardRef`
export default Form
