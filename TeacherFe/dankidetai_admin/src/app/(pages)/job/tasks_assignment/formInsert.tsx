import { FormRefType, FormType } from '@/assets/types/form';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { Dropdown, Editor, InputDate, InputText } from '@/resources/components/form';
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
const schema = yup.object({
    nameJob: yup.string(),
    nameTeacher: yup.string().required(),
    details: yup.string(),
    taskEnd: yup.date().required(),
})


const FormInsert = forwardRef<any, FormType<any>>(({ title, type, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),

    });

    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['list-Teacher'],
        queryFn: async () => {
            const response: any = await request.get<TeacherType[]>(API.teachers.getAllNoParams);
            return response.data.result || [];
        },
    });
    const JobAssignment = useMutation<any, AxiosError<ResponseType>, JobType>({
        mutationFn: (data) => {
            return request.post<JobType>(API.job.InsertJobForTeacher, data);
        },
    });


    const onSubmit = (data: any) => {
        try {
            const accout = jwtDecode(cookies.get(ACCESS_TOKEN) || "").sub
            const newData: JobType = {
                from: getDateNow(),
                due: dateToString(data.taskEnd),
                sendTo: data.nameTeacher,// neame teacher == msgv
                sendFrom: accout || "",
                name: data.nameJob,
                details: data.details,
                isCompleted: 0
            }
            console.log("data", data, "newDataq", newData)
            JobAssignment.mutate(newData, {
                onSuccess: (response) => {
                    close();
                    onSuccess?.(response.data);
                    toast.success("Lưu mới thành công");
                },
            })
        } catch (error: any) {
            toast.error(error)
        }

    };

    const show = (data: string) => {
        reset({ nameJob: data })
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
                    <form className='relative mt-2 h-auto  formgrid grid' style={{ minHeight: "50vh" }} onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
                        <div className='col-6 flex flex-column gap-3 mb-2'>
                            <Controller
                                name={"nameJob"}
                                control={control}
                                render={({ field, fieldState }) => <InputText
                                    id={`form_data_${field.name}`}
                                    value={field.value?.toString()}
                                    label={"Tên nhiệm vụ"}
                                    disabled
                                    placeholder={"Tên nhiệm vụ"}
                                    errorMessage={fieldState.error?.message}
                                    onChange={field.onChange}
                                />}
                            />
                        </div>
                        <div className='col-6 flex flex-column gap-3 mb-2'>
                            <Controller
                                name={"nameTeacher"}
                                control={control}
                                render={({ field, fieldState }) => <Dropdown
                                    id={`form_data_${field.name}`}
                                    value={field.value?.toString()}
                                    options={TeacherQuery.data?.map((t) => ({ label: t.name + " - " + t.maSo, value: t.maSo }))}
                                    label={"Tên giảng viên"}
                                    placeholder={"Tên giảng viên"}
                                    errorMessage={fieldState.error?.message}
                                    onChange={field.onChange}
                                />}

                            />
                        </div>
                        <div className='col-6 flex flex-column gap-3 mb-2'>
                            <Controller
                                name={"taskEnd"}
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
                                name={"details"}
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

                        <div style={{ bottom: "-250px" }} className='absolute botton-0 flex align-items-center justify-content-end gap-2 mt-5 p-4 w-full' >
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
                </div>

            </>
        </Dialog>
    )
})
FormInsert.displayName = `forwardRefInSert`
export default FormInsert
