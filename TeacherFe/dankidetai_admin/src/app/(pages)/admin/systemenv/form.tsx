import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { FormRefType, FormType } from '@/assets/types/form';
import { Dropdown, InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, Resolver, useForm } from 'react-hook-form';
import * as yup from "yup"
import { toast } from 'react-toastify';
import { fields } from './page';

const defaultValues: SystemType = {
    value: "",
    description: "",
}

const schema = yup.object({
    value: yup.string().required(),
    description: yup.string().required(),
    id: yup.string()
})

const Form = forwardRef<FormRefType<SystemType>, FormType<SystemType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<SystemType>, defaultValues: defaultValues
    });
    const CouncilMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data) => {
            return request.update(API.systemenv.update + `/${data?.id}`, data)
        },
    });

    const show = (data?: SystemType) => {
        setVisible(true);
        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }

    };
    const onSubmit = (data: SystemType) => {
        CouncilMutation.mutate(data, {
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
            style={{ width: '40vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            {
                type === "detail" ? <div className="p-grid">
                    <div className="p-col">
                        <Card>
                            <DataTable value={[data || []]}>
                                {fields.map((field, index) => <Column key={index} field={field.code} header={field.field} />)}
                            </DataTable>
                        </Card>
                    </div>
                </div> :
                    <form className='mt-2 flex' onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
                        <div className='col-4 flex flex-column gap-3'>
                            <Controller
                                name="value"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_name'
                                        value={field.value}
                                        label={"Giá trị"}
                                        placeholder={"Giá trị"}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        <div className='col-8 flex flex-column gap-3'>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field, fieldState }) => {
                                    return (
                                        <InputText
                                            id='form_data_industry_id'
                                            value={field.value}
                                            label={"Chi tiết"}
                                            placeholder={"Chi tiết"}
                                            errorMessage={fieldState.error?.message}
                                            onChange={field.onChange}
                                        />
                                    )
                                }}
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
Form.displayName = `forwardRef`
export default Form
