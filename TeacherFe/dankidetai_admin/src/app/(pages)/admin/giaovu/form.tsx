import ROUTER from '@/assets/configs/routers';
import * as request from '@/assets/helpers/request';
import { InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from "yup"
interface StudentFormRefType {
    show?: (data?: StudentType) => void;
    close?: () => void;
}

interface StudentFormType {
    title: string;
    type: "detail" | "edit" | "create"
    data?: StudentType
    onSuccess?: (data: StudentType) => void;
}
const defaultValues: StudentType = {
    id: 0,
    MSSV: '', Name: "",
    Class: '', DayOfBirth: "", Email: "",
    PhoneNumber: ""

}

const schema = yup.object({
    id: yup.number(),
    MSSV: yup.string().required(),
    Name: yup.string().required(),
    Class: yup.string().required(),
    DayOfBirth: yup.string().required(),
    Email: yup.string().required(),
    PhoneNumber: yup.string().min(9).max(12),
})

const Form = forwardRef<StudentFormRefType, StudentFormType>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<StudentType>, defaultValues: defaultValues
    });
    const StudentMutation = useMutation<any, AxiosError<ResponseType>, StudentType>({
        mutationFn: (data) => {
            return type === "edit" ? request.update("..", data) : request.post("..", data)
        },
    });
    const show = (data?: StudentType) => {
        setVisible(true);
        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }

    };
    const onSubmit = (data: StudentType) => {
        StudentMutation.mutate(data, {
            onSuccess: (response) => {
                close();
                onSuccess?.(response.data);
                toast.success("Cập nhật thành công");
            },
        });
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
    };

    useImperativeHandle(ref, () => ({
        show,
        close
    }));

    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '70vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            {
                type === "detail" ? <div className="p-grid">
                    <div className="p-col">
                        <Card>
                            <DataTable value={[data || []]}>
                                <Column field="STT" header="STT" />
                                <Column field="MSSV" header="MSSV" />
                                <Column field="Name" header="Name" />
                                <Column field="Class" header="Class" />
                                <Column field="DayOfBirth" header="Day of Birth" />
                                <Column field="Email" header="Email" />
                                <Column field="PhoneNumber" header="Phone Number" />
                            </DataTable>
                        </Card>
                    </div>
                </div> :
                    <form className='mt-2 flex' onSubmit={handleSubmit(onSubmit)}>
                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name="MSSV"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_mssv'
                                        value={field.value}
                                        label={"Mã số sinh viên"}
                                        placeholder={"mssv"}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Controller
                                name="Email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_Email'
                                        value={field.value}
                                        label={'Email'}
                                        placeholder={'Email'}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Controller
                                name="Name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_name'
                                        value={field.value}
                                        label={"Tên sinh viên"}
                                        placeholder={"Name"}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name="PhoneNumber"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_phone_number'
                                        value={field.value}
                                        label={'Số điện thoại'}
                                        placeholder={'phone_number'}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Controller
                                name="Class"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_Class'
                                        value={field.value}
                                        label={'Lớp'}
                                        placeholder={'class'}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Controller
                                name="DayOfBirth"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_DayOfBirth'
                                        value={field.value}
                                        label={'DayOfBirth'}
                                        placeholder={'DayOfBirth'}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>


                        <div className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white p-4'>
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
            }
        </Dialog>
    )
})
export default Form
export type { StudentFormRefType };
