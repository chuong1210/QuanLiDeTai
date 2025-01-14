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
import { MultiSelect } from '@/resources/components/form/MultiSelect';

const defaultValues: CouncilType = {
    teacherIds: [],
    subjectId: ""
}

const schema = yup.object({
    teacherIds: yup.array().required(),
    subjectId: yup.string().required()
})

const Form = forwardRef<FormRefType<CouncilType>, FormType<CouncilType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<CouncilType>, defaultValues: defaultValues
    });
    const CouncilMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data) => {
            console.log(data)
            return type === "edit" ? request.update(API.councils.update + `/${data?.id}`, { teacherIds: data?.teacherIds, subjectId: data?.subjectId }) : request.post(API.councils.insert, { teacherIds: data?.teacherIds, subjectId: data?.subjectId })
        },
    });

    const SubjectQuery = useQuery<SubjectType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ["list-Subject"],
        queryFn: async () => {
            const response: any = await request.get<SubjectType[]>(API.subjects.getAllNoParams);
            return response.data?.result || [];
        },
    });
    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ["list-TeacherQuery-head"],
        queryFn: async () => {
            const response: any = await request.get<TeacherType[]>(API.teachers.getAllNoParams);
            return response.data?.result || [];
        },
    });

    const show = (data?: CouncilType) => {
        setVisible(true);
        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }
        SubjectQuery.refetch()
        TeacherQuery.refetch()

    };
    const onSubmit = (data: CouncilType) => {
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
                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name="subjectId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id='form_data_name'
                                        options={SubjectQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
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
                                name="teacherIds"
                                control={control}
                                render={({ field, fieldState }) => {
                                    return (
                                        <MultiSelect
                                            id='form_data_industry_id'
                                            options={TeacherQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                            value={field.value}
                                            label={"Giáo Viên"}
                                            placeholder={"Giáo Viên"}
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
