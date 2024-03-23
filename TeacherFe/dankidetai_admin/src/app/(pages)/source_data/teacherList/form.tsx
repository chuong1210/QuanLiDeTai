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
import { ChucVuValue, HocViValue } from '@/assets/configs/general';
import { MultiSelect } from '@/resources/components/form/MultiSelect';
// import { Grid } from 'primereact/grid';


const defaultValues: TeacherType = {
    maSo: '', name: "",
    email: "", phoneNumber: "",
    subjectName: "",
    departmentName: "",
    chucVu: [], hocVi: []
}
const schema = yup.object({
    maSo: yup.string().required(),
    name: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().min(8).max(11).required(),
    hocVi: yup.array().required(),
    chucVu: yup.array().required(),
    departmentName: yup.string().required(),
    subjectName: yup.string().required()

})

const Form = forwardRef<FormRefType<TeacherType>, FormType<TeacherType>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<TeacherType>, defaultValues: defaultValues

    });

    const StudentMutation = useMutation<any, AxiosError<ResponseType>, TeacherType>({
        mutationFn: (data) => {
            return type === "edit" ? request.update(API.teachers.update + `/${data.id}`, { name: data.name }) : request.post(API.teachers.insert, { name: data.name })
        },
    });

    const SubjectsQuery = useQuery<SubjectType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['list-Subjects'],
        queryFn: async () => {
            const response = await request.get<SubjectType[]>(API.subjects.getAll);

            return response.data || [];
        },
    });
    const DepartmentsQuery = useQuery<DepartmentType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['list-Departments'],
        queryFn: async () => {
            const response = await request.get<DepartmentType[]>(API.department.getAll);
            return response.data || [];
        },
    });


    const show = (data?: TeacherType) => {
        setVisible(true);
        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }
        SubjectsQuery.refetch()
        DepartmentsQuery.refetch()

    };
    const onSubmit = (data: TeacherType) => {
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
            onClick={(e) => { e.preventDefault() }}
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
                            return fieldItem.typeInput !== "null" && <div key={index} className='col-6 flex flex-column gap-3'>
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
                                            value={new Date(field.value?.toString() || "19/10/2003")}
                                            label={fieldItem.field}
                                            placeholder={fieldItem.field}
                                            errorMessage={fieldState.error?.message}
                                            onChange={field.onChange}
                                        /> : <Dropdown
                                            id='form_data_industry_id'
                                            options={SubjectsQuery.data?.map((t) => ({ label: t.name, value: t.name }))}
                                            value={field.value?.toString()}
                                            label={"Chuyên ngành"}
                                            placeholder={"Chuyên ngành"}
                                            errorMessage={fieldState.error?.message}
                                            onChange={(e) => {
                                                field.onChange({ name: e })
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        }))}
                        {/* chức vụ drop */}
                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name={"chucVu"}
                                control={control}
                                render={({ field, fieldState }) => {
                                    console.log(field.value)
                                    return (
                                        <MultiSelect
                                            id='form_data_chucVu'
                                            options={ChucVuValue}
                                            value={field.value && Array.isArray(field.value) ? field.value : undefined}
                                            label={"Chức vụ"}
                                            placeholder={"Chức vụ"}
                                            errorMessage={fieldState.error?.message}
                                            onChange={(e) => {
                                                field.onChange(e)
                                            }}
                                        />
                                    )
                                }}
                            />
                        </div>
                        {/* học vị drop */}
                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name={"hocVi"}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <MultiSelect
                                        id='form_data_hocVi'
                                        options={HocViValue}
                                        value={field.value && Array.isArray(field.value) ? field.value : undefined}
                                        label={"Học Vị"}
                                        placeholder={"Học Vị"}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        {/* department drop */}
                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name={"departmentName"}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id='form_data_departmentName'
                                        options={DepartmentsQuery.data?.map(t => ({ label: t.name, value: t.name }))}
                                        //value={field.value}
                                        label={"Ngành"}
                                        placeholder={"Ngành"}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        {/* subject drop */}
                        <div className='col-6 flex flex-column gap-3'>
                            <Controller
                                name={"subjectName"}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        id='form_data_subjectName'
                                        options={SubjectsQuery.data?.map((t) => ({ label: t.name, value: t.name }))}
                                        //value={field.value}
                                        label={"Chuyên ngành"}
                                        placeholder={"Chuyên ngành"}
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
                            <Button type='submit' label={'save'} icon='pi pi-save' />
                        </div>
                    </form>
            }
        </Dialog>
    )
})
Form.displayName = `forwardRef`
export default Form
