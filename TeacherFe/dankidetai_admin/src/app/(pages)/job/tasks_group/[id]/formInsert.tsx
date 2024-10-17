import { FormRefType, FormType } from '@/assets/types/form';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { Dropdown, Editor, InputDate, InputNumber, InputText } from '@/resources/components/form';
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
    groupId: yup.string()
})
const FormInsert = forwardRef<any, FormType<any>>(({ title, type, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),

    });


    const JobAssignment = useMutation<any, AxiosError<ResponseType>, JobType>({
        mutationFn: (data) => {
            return request.post<JobType>(API.job.InsertJobForStudent, data);
        },
    });


    const onSubmit = (data: any) => {
        try {
            JobAssignment.mutate(data, {
                onSuccess: (response) => {
                    close();
                    toast.success("Tạo nhiệm vụ mới thành công");
                    onSuccess
                },
            })
        } catch (error: any) {
            toast.error(error)
        }

    };

    const show = (data: string) => {
        // console.log(data)
        reset({ groupId: data })
        setVisible(true);
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
            style={{ width: '90vw', minHeight: "80vh" }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            <>
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

                        <div className=' botton-0 flex align-items-center justify-content-end gap-2 mt-5 p-4 w-full' >
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
                </div>

            </>
        </Dialog>
    )
})
FormInsert.displayName = `forwardRefInSert`
export default FormInsert
