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
import { key } from '../department/page';
import { toast } from 'react-toastify';
import { fields } from './page';

const defaultValues: SubjectType = {
    name: "",
    departments: {
        name: ""
    }
}

const schema = yup.object({
    //id: yup.number(),
    name: yup.string().required(),
    departments: yup.object().shape({
        name: yup.string().required()
    })
})

const Form = forwardRef<FormRefType<SubjectType>, FormType<SubjectType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<SubjectType>, defaultValues: defaultValues
    });
    const StudentMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data) => {
            return type === "edit" ? request.update(API.subjects.update + `/${data.id}`, { name: data.name, nameDepartment: data.departments.name }) : request.post(API.subjects.insert, { name: data.name, nameDepartment: data.departments.name })
        },
    });

    const DeparmentQuery = useQuery<DepartmentType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ["list-Subject"],
        queryFn: async () => {
            const response: any = await request.get<DepartmentType[]>(API.department.getAllNoParams);
            return response.data.result || [];
        },
    });


    const show = (data?: SubjectType) => {
        setVisible(true);
        console.log(data)
        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }
        DeparmentQuery.refetch()

    };
    const onSubmit = (data: SubjectType) => {
        console.log(data)
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
                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_name'
                                        value={field.value}
                                        label={"Bộ môn"}
                                        placeholder={"Bộ môn"}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name="departments"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id='form_data_industry_id'
                                        options={DeparmentQuery.data?.map((t) => ({ label: t.name, value: t.name }))}
                                        value={field.value?.name}
                                        label={"Ngành"}
                                        placeholder={"Ngành"}
                                        errorMessage={fieldState.error?.message}
                                        onChange={(e) => {
                                            field.onChange({ name: e })
                                        }}
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
