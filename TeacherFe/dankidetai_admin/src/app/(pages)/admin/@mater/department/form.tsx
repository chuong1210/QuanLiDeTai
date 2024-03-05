import API from '@/assets/configs/api';
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
    show?: (data?: DepartmentType) => void;
    close?: () => void;
}

interface StudentFormType {
    title: string;
    type: "detail" | "edit" | "create"
    data?: DepartmentType
    onSuccess?: (data: DepartmentType) => void;
}
const defaultValues: DepartmentType = {
    id: 0,
    name: ""

}

const schema = yup.object({
    id: yup.number(),
    name: yup.string().required(),

})

const Form = forwardRef<StudentFormRefType, StudentFormType>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<DepartmentType>, defaultValues: defaultValues
    });
    const StudentMutation = useMutation<any, AxiosError<ResponseType>, DepartmentType>({
        mutationFn: (data) => {
            return type === "edit" ? request.update(API.department.update, data) : request.post(API.department.insert, data)
        },
    });
    const show = (data?: DepartmentType) => {
        setVisible(true);
        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }

    };
    const onSubmit = (data: DepartmentType) => {
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
                                <Column field="id" header="id" />
                                <Column field="name" header="name" />
                            </DataTable>
                        </Card>
                    </div>
                </div> :
                    <form className='mt-2 flex' onSubmit={handleSubmit(onSubmit)}>
                        <div className='col-12 flex flex-column gap-3'>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_name'
                                        value={field.value}
                                        label={"Ngành"}
                                        placeholder={"Ngành"}
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
