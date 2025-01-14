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
export interface ResearchParams {
    name: string;
    note: string;
    minMembers: number;
    maxMembers: number;
    instructorsIds?: string;
    detail: string;
    // stage: number;
    // schoolYear: string;
}
const defaultValues: ResearchParams = {
    name: "",
    minMembers: 1,
    note: "",
    maxMembers: 3,
    instructorsIds: "",
    detail: "",
    // stage: 1,
    // schoolYear: "2024-2025"
}
const schema = yup.object({
    name: yup.string().required(),
    note: yup.string(),

    minMembers: yup.number().required().min(1),
    maxMembers: yup.number().required().moreThan(yup.ref("minMembers")),
    instructorsIds: yup.string(),
    // students: yup.array().test('check-students', 'Invalid number of students', function (value) {
    //     const { minMembers, maxMembers } = this.parent;
    //     //return //!value || (value.length >= minMembers && value.length <= maxMembers);
    //     if (value && value?.length > 0) {
    //         return (value.length >= minMembers && value.length <= maxMembers);
    //     } else { return true }
    // }),
    // stage: yup.number().required(),
    // schoolYear: yup.string().required(),
    detail: yup.string().required(),
})


const Form = forwardRef<FormRefType<ReSearchType>, FormType<ReSearchType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues

    });
    const ReSearchMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (dataa) => {
            if (type === "edit") {
                return request.update(API.reSearch.update + `/${data?.id}`, dataa)
            } else {
                return request.post(API.reSearch.insert, { researches: [dataa] })
            }
        },
    });


    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['list-Teacher'],
        queryFn: async () => {
            const response: any = await request.get<TeacherType[]>(API.teachers.getAllNoParams);
            //console.log(response.data?.result)
            return response.data?.result || [];
        },
    });


    const show = async (data?: ReSearchType) => {
        setVisible(true);
        if (data) {
            const req: any = await request.get<ResearchParams>(API.reSearch.showone + data?.id);
            reset(req.data?.result);
        } else {
            reset(defaultValues);

        }
        TeacherQuery.refetch()

    };


    const onSubmit = (data: any) => {
        const req = {
            name: data?.name,
            detail: data?.detail,
            notes: data?.note,
            maxMembers: data?.maxMembers,
            minMembers: data?.minMembers,
            subInstructorId: data?.instructorsIds,
        }
        ReSearchMutation.mutate(req, {
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
                        name={"note"}
                        control={control}
                        render={({ field, fieldState }) => <InputText
                            id={`form_data_${field.name}`}
                            value={field.value?.toString()}
                            label={"Note"}
                            placeholder={"Note"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}
                    />

                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={'instructorsIds'}
                        control={control}
                        render={({ field, fieldState }) => <Dropdown
                            id={`form_data_${field.name}`}
                            value={field.value ? field.value : undefined}
                            options={TeacherQuery.data?.map((t) => ({ label: `${t.name} - ${t.code}`, value: t.id }))}
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

                {/* <div className='col-2 flex flex-column gap-3 mb-2 mr-6'>
                    <Controller
                        name={"schoolYear"}
                        control={control}
                        render={({ field, fieldState }) => <InputText
                            id={`form_data_${field.name}`}
                            value={field.value}
                            label={"Năm học"}
                            placeholder={"Năm học"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}
                    />
                </div>
                <div className='col-2 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={'stage'}
                        control={control}
                        render={({ field, fieldState }) => <InputNumber
                            id={`form_data_${field.name}`}
                            value={field.value}
                            label={"Đợt"}
                            placeholder={"Đợt"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}
                    />
                </div> */}

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
                            onChange={field.onChange}
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
                    <Button type='submit' label={'save'} icon='pi pi-save' />
                </div>
            </form>
        </Dialog>
    )
})
Form.displayName = `forwardRef`
export default Form
