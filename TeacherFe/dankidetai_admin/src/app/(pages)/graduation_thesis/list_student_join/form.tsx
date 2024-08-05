import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { FormRefType, FormType } from '@/assets/types/form';
import { Dropdown, InputDate, InputText } from '@/resources/components/form';
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
import { fields, key } from './page';
import { toast } from 'react-toastify';
// import { Grid } from 'primereact/grid';


const defaultValues: StudentType = {
    maSo: '', name: "",
    myClass: '', email: "",
    phoneNumber: "", subjectName: ""
}
const schema = yup.object({
    maSo: yup.string().required(),
    name: yup.string().required(),
    myClass: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().min(8).max(11).required(),
    //subjectName: yup.string().required()

})

const Form = forwardRef<FormRefType<StudentType>, FormType<StudentType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<StudentType>, defaultValues: defaultValues

    });

    const StudentMutation = useMutation<any, AxiosError<ResponseType>, StudentType>({
        mutationFn: (data) => {
            return type === "edit" ? request.update(API.students.update + `/${data.id}`, data) :
                request.post(API.students.insert_from_excel, { students: [data] })
        },
    });

    const SubjectsQuery = useQuery<SubjectType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['list-Subject'],
        queryFn: async () => {
            const response: any = await request.get<SubjectType[]>(API.subjects.getAllNoParams);
            console.log(response)
            return response.data.result || [];
        },
    });
    const DepartmentQuery = useQuery<DepartmentType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['list-Department'],
        queryFn: async () => {
            const response: any = await request.get<DepartmentType[]>(API.department.getAllNoParams);

            return response.data.result || [];
        },
    });

    const show = (data?: StudentType) => {
        setVisible(true);
        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }
        SubjectsQuery.refetch()
        DepartmentQuery.refetch()

    };
    const onSubmit = (data: StudentType) => {
        const newData = {
            ...data,
            chucVu: "HỌC SINH",
            user_id: "",
        }
        StudentMutation.mutate(newData, {
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
                type === "detail" ?
                    <div className="p-grid">
                        <div className="p-col">
                            <Card>
                                <DataTable value={[data || []]}>
                                    {fields.map((field, index) => <Column key={index} field={field.code} header={field.field} />)}
                                </DataTable>
                            </Card>
                        </div>
                    </div> :
                    <form className='mt-2 formgrid grid' onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
                        {fields.map(((fieldItem, index) => {
                            if (type === "edit" && fieldItem.code === "maSo") {
                                fieldItem.typeInput = "disabled"
                            } if (type === "create" && fieldItem.code === "maSo") {
                                fieldItem.typeInput = "text"
                            }
                            return fieldItem.typeInput === "text" || fieldItem.typeInput === "date" || fieldItem.typeInput === "disabled" ? <div key={index} className='col-6 flex flex-column gap-3'>
                                <Controller
                                    name={fieldItem.code}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        fieldItem.typeInput === "text" ? <InputText
                                            id={`form_data_${field.name}`}
                                            value={field.value?.toString()}
                                            label={fieldItem.field}
                                            placeholder={fieldItem.field}
                                            errorMessage={fieldState.error?.message}
                                            onChange={field.onChange}
                                        /> : fieldItem.typeInput === "date" ? <InputDate
                                            id={`form_data_${field.name}`}
                                            value={new Date(field.value || "19/10/2003")}
                                            label={fieldItem.field}
                                            placeholder={fieldItem.field}
                                            errorMessage={fieldState.error?.message}
                                            onChange={field.onChange}
                                        /> : <InputText
                                            id={`form_data_${field.name}`}
                                            value={field.value?.toString()}
                                            label={fieldItem.field}
                                            disabled
                                            placeholder={fieldItem.field}
                                            errorMessage={fieldState.error?.message}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />



                            </div> : null
                        }))}
                        <div className='col-6 flex flex-column gap-3'>

                            <Controller
                                name="departmentName"
                                control={control}
                                render={({ field, fieldState }) => {
                                    return (

                                        <Dropdown
                                            id='form_data_industry_id'
                                            options={DepartmentQuery.data?.map((t) => ({ label: t.name, value: t.name }))}
                                            value={field.value}
                                            label={"Khoa"}
                                            placeholder={"Khoa"}
                                            errorMessage={fieldState.error?.message}
                                            onChange={field.onChange}
                                        />
                                    )
                                }
                                }
                            />
                        </div>
                        <div className='col-6 flex flex-column gap-3'>

                            <Controller
                                name="subjectName"
                                control={control}
                                render={({ field, fieldState }) => {
                                    return (
                                        <Dropdown
                                            id='form_data_industry_id'
                                            options={SubjectsQuery.data?.map((t) => ({ label: t.name, value: t.name }))}
                                            value={field.value}
                                            label={"Ngành"}
                                            placeholder={"Ngành"}
                                            errorMessage={fieldState.error?.message}
                                            onChange={field.onChange}
                                        />
                                    )
                                }
                                }
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
