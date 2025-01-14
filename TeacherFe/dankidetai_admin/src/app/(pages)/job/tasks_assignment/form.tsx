import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { FormRefType, FormType } from '@/assets/types/form';
import { Editor, InputDate, InputNumber, InputText } from '@/resources/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup"
import { toast } from 'react-toastify';
import { roleE } from '@/assets/configs/general';
import { MultiSelect } from '@/resources/components/form/MultiSelect';
import { getJobFrom } from '@/assets/configs/job';
import { ROLE_USER } from '@/assets/configs/request';
import { cookies } from '@/assets/helpers';
// import { Grid } from 'primereact/grid';

const defaultValue = {
    name: getJobFrom(cookies.get<roleE[]>(ROLE_USER) || [roleE.giaovien])?.name,
    description: '',
    detail: '',
    quantityRequirement: 1,
    from: new Date(),
    due: new Date(),
    teacherIds: [],
}
const schema = yup.object({
    from: yup.date().required(),
    due: yup.date().required(),
    name: yup.string(),
    description: yup.string(),
    detail: yup.string().required(),
    quantityRequirement: yup.number().required(),
    teacherIds: yup.array(),
    id: yup.string(),
})


const Form = forwardRef<FormRefType<JobAll>, FormType<JobAll>>(({ type, title, data, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const TeacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['list-teacher'],
        queryFn: async () => {
            const role = getJobFrom(cookies.get<roleE[]>(ROLE_USER) || [roleE.giaovien])?.id
            let url = API.teachers.getAllNoParams
            if (role === 1) {
                url = API.teachers.showAllHeadOfDepartment
            }
            if (role === 2) {
                url = API.teachers.showAllToSelection
            }
            const response: any = await request.get<TeacherType[]>(url);
            return response.data?.result || [];
        },
    });
    const JobAssignment = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data) => {
            return type === "edit" ? request.update(API.job.UpdateJobForTeacher + data?.id, data) :
                request.post<any>(API.job.InsertJobForTeacher, data);

        },
    });
    const show = async (data?: any, type?: "detail" | "edit" | "create") => {
        console.log(data, data && data?.name && type === "create", data, data?.name, type)
        setVisible(true);
        if (data && data?.id && type === "edit") {
            const response = await request.get<JobType[]>(`${API.job.ShowJobDetail}${data?.id}`);
            console.log(response)
            let responseData: any = response.data ?? [];
            reset(
                {
                    id: data?.id,
                    name: data?.name,
                    description: data?.description,
                    detail: responseData?.result?.detail,
                    quantityRequirement: data?.quantityRequirement,
                    from: new Date(data?.from),
                    due: new Date(data?.due),
                    teacherIds: data?.jobTeacherDetails?.map((item: any) => item?.teacher?.id)
                }
            )
        }
        else if (data && data?.name && type === "create") {
            reset({
                ...defaultValue,
                name: data.name
            })
        }
    };
    const onSubmit = (data: any) => {
        try {
            console.log(data)
            JobAssignment.mutate(data, {
                onSuccess: () => {
                    close();
                    toast.success("Lưu mới thành công");
                    if (onSuccess) onSuccess(data);
                },
            })
        } catch (error: any) {
            toast.error(error)
        }

    };

    const close = () => {
        setVisible(false);

        reset(defaultValue);
    };

    useImperativeHandle(ref, () => ({
        show,
        close
    }));

    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '80vw', height: '100vh' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            <form className='relative mt-2 h-auto  formgrid grid' style={{ minHeight: "50vh", maxWidth: "100vw" }}
                onSubmit={handleSubmit(onSubmit)}
                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
                <div className='col-6 flex flex-column gap-3 mb-2'>

                    <Controller
                        name={"name"}
                        control={control}
                        render={({ field, fieldState }) => <InputText
                            id={"name"}
                            value={field.value}
                            label={"Tên nhiệm vụ"}
                            placeholder={"Tên nhiệm vụ"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                            disabled={true}
                        />}
                    />
                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>

                    <Controller
                        name={"teacherIds"}
                        control={control}
                        render={({ field, fieldState }) => <MultiSelect
                            id='teacherIds'
                            options={TeacherQuery.data?.map((t) => ({ label: t.name + " - " + t.code, value: t.id }))}
                            value={field.value && Array.isArray(field.value) ? field.value : undefined}
                            label={"Giảng viên nhận nhiệm vụ"}
                            placeholder={"Giảng viên nhận nhiệm vụ"}
                            errorMessage={fieldState.error?.message}
                            disabled={type === "edit"}
                            onChange={(e) => {
                                field.onChange(e)
                            }}
                        />
                        }

                    />
                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"from"}
                        control={control}
                        render={({ field, fieldState }) => <InputDate
                            id={`form_data_${field.name}`}
                            label={"Thời gian bắt đầu"}
                            placeholder={"Thời gian bắt đầu"}
                            value={field.value}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />

                </div>

                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"due"}
                        control={control}
                        render={({ field, fieldState }) => <InputDate
                            id={`form_data_${field.name}`}
                            label={"Thời gian kết thúc"}
                            value={field.value}
                            placeholder={"Thời gian kết thúc"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />

                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={'quantityRequirement'}
                        control={control}
                        render={({ field, fieldState }) => <InputNumber
                            id={`form_data_${field.name}`}
                            label={"Số lượng yêu cầu"}
                            value={field.value}
                            placeholder={"Số lượng yêu cầu"}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />}

                    />

                </div>

                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <Controller
                        name={"description"}
                        control={control}
                        render={({ field, fieldState }) => <Editor
                            id={`form_data_${field.name}`}
                            label={"Mô tả"}
                            placeholder={"Mô tả"}
                            errorMessage={fieldState.error?.message}
                            value={field.value}
                            onChange={field.onChange}
                        />}

                    />
                </div>
                <div className='col-12 flex flex-column gap-3 mb-2 mt-4'>
                    <Controller
                        name={"detail"}
                        control={control}
                        render={({ field, fieldState }) => <Editor
                            id={`form_data_${field.name}`}
                            label={"Chi tiết"}
                            placeholder={"Chi tiết"}
                            errorMessage={fieldState.error?.message}
                            value={field.value}
                            onChange={field.onChange}
                        />}

                    />
                </div>

                <div className=' botton-0 flex align-items-center justify-content-end gap-2 mt-5 p-4 w-full' >
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
        </Dialog>
    )
})
Form.displayName = `forwardRef`
export default Form