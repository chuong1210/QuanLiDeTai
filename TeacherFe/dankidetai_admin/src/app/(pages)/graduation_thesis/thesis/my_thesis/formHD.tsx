"use client"
import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { Dropdown, Editor, InputDate, InputNumber, InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from "@tanstack/react-query";

import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { toast } from 'react-toastify';
import { MultiSelect } from '@/resources/components/form/MultiSelect';
import { FormRefType, FormType } from '@/assets/types/form';
import { Dialog } from 'primereact/dialog';
export interface ResearchAdvisorId {
    advisorId?: string;
    id?: string;
}

const defaultValues = {
    advisorId: ""
    // stage: 1,
    // schoolYear: "2024-2025"
}
const schema = yup.object({
    id: yup.string(),
    advisorId: yup.string().required(),
})


const FormHD = forwardRef<FormRefType<ResearchAdvisorId>, FormType<ResearchAdvisorId>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues

    });
    const ReSearchMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (dataa: ResearchAdvisorId) => {

            return request.patch(`/researches/${dataa.id}/update-thesis-advisor/${dataa.advisorId}`)

        },
    });


    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['list-Teacher-showAllToSelection'],
        queryFn: async () => {
            const response: any = await request.get<TeacherType[]>(API.teachers.showAllToSelection);
            //console.log(response.data?.result)
            return response.data?.result || [];
        },
    });


    const show = async (data?: any) => {
        setVisible(true);
        if (data) {
            // const req: any = await request.get<ResearchAdvisorId>(API.reSearch.showone + data?.id);
            reset(data);
        } else {
            reset(defaultValues);

        }
        TeacherQuery.refetch()

    };


    const onSubmit = (data: { advisorId: string }) => {
        // console.log(data)
        ReSearchMutation.mutate(data, {
            onSuccess: (response: any) => {
                close();
                onSuccess?.(response.data);
                toast.success("Tạo thành công");
            },
        })

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
            style={{ width: '30vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            <form className='mt-2 formgrid grid' onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>

                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={'advisorId'}
                        control={control}
                        render={({ field, fieldState }) => <Dropdown
                            id={`form_data_${field.name}`}
                            value={field.value ? field.value : undefined}
                            options={TeacherQuery.data?.map((t) => ({ label: `${t.name} - ${t.code}`, value: t.id }))}
                            label={"Giảng viên phản biện"}
                            placeholder={"Giảng viên phản biện"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
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
                    <Button type='submit' label={'save'} icon='pi pi-save' />
                </div>
            </form>
        </Dialog>
    )
})
FormHD.displayName = `forwardHDRef`
export default FormHD
