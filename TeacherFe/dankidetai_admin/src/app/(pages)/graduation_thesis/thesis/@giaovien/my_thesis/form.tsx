"use client"
import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { Dropdown, Editor, InputDate, InputNumber, InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
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
    nameThesis: yup.string().required(),
    minTV: yup.number().required().min(1),
    maxTV: yup.number().required().moreThan(yup.ref("minTV")),
    idBomon: yup.array().required(),
    instructors: yup.array().required(),
    students: yup.array().test('check-students', 'Invalid number of students', function (value) {
        const { minTV, maxTV } = this.parent;
        return !value || (value.length >= minTV && value.length <= maxTV);
    }),
    details: yup.string(),
})


const Form = forwardRef<FormRefType<ThesisType>, FormType<ThesisType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        //defaultValues: defaultValues

    });

    const StudentListQuery = useQuery<StudentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,

        queryKey: ['list-Students'],
        queryFn: async () => {

            const response = await request.get<StudentType[]>(`${API.students.getAll}`);
            // console.log("student list", response)
            let responseData = response.data ?? [];

            return responseData || [];
        },
    });

    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,

        queryKey: ['list-Teacher'],
        queryFn: async () => {
            const response = await request.get<TeacherType[]>(API.teachers.getAll);
            // console.log("teacher list", response)
            return response.data || [];
        },
    });
    const SubjectsQuery = useQuery<SubjectType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['list-Subjects'],
        queryFn: async () => {
            const response = await request.get<SubjectType[]>(API.subjects.getAll);
            // console.log("subject list", response)
            return response.data || [];
        },
    });
    const show = (data?: any) => {
        setVisible(true);
        if (data) {
            reset(data);
        } else {

        }
        SubjectsQuery.refetch()
        StudentListQuery.refetch()
        TeacherQuery.refetch()

    };
    const onSubmit = (data: any) => {
        // StudentMutation.mutate(data, {
        //     onSuccess: (response) => {
        //         close();
        //         onSuccess?.(response.data);
        //         toast.success("Cập nhật thành công");
        //     },
        // });
        console.log(data)
        toast.success("Cập nhật thành công");
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
                        name={"nameThesis"}
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
                        name={"idBomon"}
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
                        name={'instructors'}
                        control={control}
                        render={({ field, fieldState }) => <MultiSelect
                            id={`form_data_${field.name}`}
                            value={field.value ? field.value : undefined}
                            options={TeacherQuery.data?.map((t) => ({ label: `${t.name},msgv:${t.maSo}`, value: t.maSo }))}
                            label={"Giảng viên hướng dẫn"}
                            placeholder={"Giảng viên hướng dẫn"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />
                </div>
                <div className='col-2 flex flex-column gap-3 mb-2 mr-6'>
                    <Controller
                        name={'minTV'}
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
                        name={'maxTV'}
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
                            options={StudentListQuery.data?.map((t) => ({ label: `${t.name},mssv:${t.maSo}`, value: t.maSo }))}
                            errorMessage={fieldState.error?.message}
                            value={field.value}
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
        </Dialog>
    )
})
Form.displayName = `forwardRef`
export default Form
