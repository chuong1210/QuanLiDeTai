import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { FormRefType, FormType } from '@/assets/types/form';
import { InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from "yup"
import { key } from './page';

const defaultValues: DepartmentType = {
    name: ""

}

const schema = yup.object({
    id: yup.number(),
    name: yup.string().required(),

})

const Form = forwardRef<FormRefType<DepartmentType>, FormType<DepartmentType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<DepartmentType>, defaultValues: defaultValues
    });
    Form.displayName = `forwardRef${key}`
    const StudentMutation = useMutation<any, AxiosError<ResponseType>, DepartmentType>({
        mutationFn: (data) => {

            return type === "edit" ? request.update(`${API.department.update}/4`, JSON.stringify({
                "name": "Công nghệ thông tin"
            })) : request.post(API.department.insert, { name: data.name })
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

    // const axios = require('axios');
    // let dataa = JSON.stringify({
    //     "name": "Công nghệ thông tin"
    // });

    // let config = {
    //     method: 'put',
    //     maxBodyLength: Infinity,
    //     url: 'http://localhost:8888/departments/update/4',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnaWFvdnUxMjM0NSIsImlhdCI6MTcxMTQ1MTczMywiZXhwIjoxNzExNTM4MTMzfQ.JPV8eGXiRXrkN07-cpX9-sBu0ndBmJuI_C7zlPmQdhk'
    //     },
    //     data: dataa
    // };

    // axios.request(config)
    //     .then((response: any) => {
    //         console.log(JSON.stringify(response.data));
    //     })
    //     .catch((error: any) => {
    //         console.log(error);
    //     });

















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
                    <form className='mt-2 flex' onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
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
Form.displayName = `forwardRef`
export default Form
