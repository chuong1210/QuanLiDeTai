"use client"
import XLSX from "@/assets/helpers/XLSX";
import { InputDate, InputFile } from "@/resources/components/form";
import { Loader } from "@/resources/components/UI";
import { Dropdown } from "@/resources/components/form";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaInfoCircle } from 'react-icons/fa';
import { FormRefType, TypeSelected } from "@/assets/types/form";
import Form from "./form";
import * as request from "@/assets/helpers/request"
import { ConfirmModalRefType } from "@/assets/types/modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import API from "@/assets/configs/api";
import { DropdownValue, roleE } from "@/assets/configs/general";
import Confirm from "@/resources/components/UI/Confirm";
import { useSelector } from "react-redux";
import { cookies } from "@/assets/helpers";
import { ROLE_USER } from "@/assets/configs/request";
export const key = "giáo viên"
// chờ có file hoàng chỉnh rồi mới làm tiếp
interface fieldsType {
    field: string;
    code: 'maSo' | "name" | "hocVi" | "email" | "phoneNumber" | "subjectName" | "chucVu" | 'departmentName';
    typeInput: string
}
export const fields: fieldsType[] = [
    { field: "msgv", code: "maSo", typeInput: "text" },
    { field: "Tên", code: "name", typeInput: "text" },
    { field: "Email", code: "email", typeInput: "text" },
    { field: "Số điện thoại", code: "phoneNumber", typeInput: "text" },
    { field: "Học vị", code: "hocVi", typeInput: "null" },
    { field: "Chức vụ", code: "chucVu", typeInput: "null" },
    { field: "ngành", code: "departmentName", typeInput: "null" },
    { field: "Chuyên ngành", code: "subjectName", typeInput: "null" }
]

function Page() {

    const fieldsDefault = [{
        maSo: '2001', name: "Trần Văn Thọ",
        hocVi: 'Tiến sĩ', email: "VanTho@gmail.com",
        chucVu: "GIÁO VIÊN", departmentName: "Công Nghệ Thông Tin",
        phoneNumber: "0344197197", subjectName: "Kỹ thuật phần mềm"
    }];

    const [teacherOnExcel, setTeacherOnExcel] = useState<TeacherType[]>([])
    const [setlected, setSelected] = useState<TypeSelected<TeacherType>>()
    const formRef = useRef<FormRefType<TeacherType>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    // const roles = useSelector((state: Rootstate) => state.role.role);


    const teacherListQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response = await request.get<TeacherType[]>(`${API.teachers.getAll}`);
            let responseData = response.data ?? [];
            if (responseData) {
                responseData = responseData.map((teacher: any) => {
                    teacher.hocVi = teacher.hocVi.split(",");
                    teacher.chucVu = teacher.chucVu.split(",");
                    if (teacher.subjectName) teacher.subjectName = teacher.subjects.name

                    return teacher
                })
            }
            return responseData || [];
        },
    });

    const teacherListMutation = useMutation<any, AxiosError<ResponseType>, TeacherType>({
        mutationFn: (data) => {
            return request.remove(`${API.teachers.delete}`, { data: [data.id] });
        },
    });
    const teacherListMutationInsert = useMutation<any, AxiosError<ResponseType>, TeacherType[]>({
        mutationFn: (data) => {
            return request.post(`${API.teachers.insert}`, { teachers: data });
        },
    });

    const renderActions = (data: TeacherType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                    formRef.current?.show?.(data);
                    setSelected({ type: "detail", data: data })
                }} />
                {
                    cookies.get<roleE>(ROLE_USER)?.includes(roleE.admin) && (
                        <>
                            <i
                                className='pi pi-pencil hover:text-primary cursor-pointer'
                                onClick={() => {
                                    formRef.current?.show?.(data);
                                    setSelected({ type: "edit", data: data })
                                }}
                            />
                            <i
                                className='pi pi-trash hover:text-red-600 cursor-pointer'
                                onClick={(e) => {
                                    confirmModalRef.current?.show?.(e, data, `Bạn có chắc muốn xóa ${key} ${data.name}`);
                                }}
                            />
                        </>
                    )
                }
            </div>
        );
    };
    const onAddteacherExcel = (data: TeacherType[]) => {
        teacherListMutationInsert.mutate(data, {
            onSuccess: () => {
                teacherListQuery.refetch();
                toast.success("Thêm thành công");
            },
        })
    }
    const onRemove = (data: TeacherType) => {
        teacherListMutation.mutate(data, {
            onSuccess: () => {
                setTeacherOnExcel([])
                teacherListQuery.refetch();
                toast.success("Xóa thành công");
            },
        });
    }
    return (
        <div>{teacherListQuery.isFetching || teacherListMutation.isPending && <Loader />}
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />
            {
                cookies.get<roleE>(ROLE_USER)?.includes(roleE.admin) && (
                    <>

                        <div className="my-3 border-bottom-2 py-3">

                            <h3>Thực hiện thêm {key} vào hệ thống</h3>

                            <div >
                                <Button className="my-3" onClick={() => XLSX.handleExportFile(fieldsDefault, "FileteacherExample")}>Export fie mẫu</Button>
                                <h3>chose file</h3>
                                <InputFile
                                    accept='.xlsx ,.xls'
                                    id="importFile"
                                    multiple={true}
                                    onChange={(e) => {
                                        XLSX.handleImportFile(e, (data) => {
                                            setTeacherOnExcel(data)
                                        })
                                    }}
                                    onRemove={() => {
                                        setTeacherOnExcel([])
                                    }}
                                    onSubmitFile={() => {
                                        onAddteacherExcel(teacherOnExcel)
                                    }}
                                />
                            </div>
                            <div >

                                <DataTable
                                    value={teacherOnExcel}
                                    rowHover={true}
                                    stripedRows={true}
                                    showGridlines={true}
                                    emptyMessage={'list_empty'}
                                >

                                    <Column
                                        alignHeader='center'
                                        headerStyle={{
                                            background: 'var(--bluegray-100)',
                                            color: 'var(--bluegray-900)',
                                            whiteSpace: 'nowrap',
                                        }}
                                        header={'Lựa chọn'}
                                        body={(data) => <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                                            formRef.current?.show?.(data);
                                            setSelected({ type: "detail", data: data })
                                        }} />}
                                    />

                                    {fields.map((field, index) => <Column
                                        key={index}
                                        alignHeader='center'
                                        headerStyle={{
                                            background: 'var(--bluegray-100)',
                                            color: 'var(--bluegray-900)',
                                            whiteSpace: 'nowrap',
                                        }}
                                        field={field.code}
                                        header={field.field}
                                    />)}


                                </DataTable>
                                <div className='flex align-items-center justify-content-between bg-white px-3 py-2'>
                                    <Dropdown
                                        id='date_created_filter'
                                        value={DropdownValue[0].code}
                                        optionValue='code'
                                        onChange={(sortCode) => {

                                        }}
                                        options={DropdownValue}
                                    />

                                    <Paginator
                                        className='border-noround p-0'
                                    />

                                </div>
                            </div>
                        </div>


                        <h3 >Danh sách {key} hiện tại</h3>

                        <Button
                            label={`Thêm ${key} mới`}
                            icon='pi pi-plus'
                            size='small'
                            className="my-3"
                            onClick={() => {
                                formRef.current?.show?.();
                                setSelected({ type: "create", data: undefined })
                            }}
                        />
                    </>)}

            <div className="my-3">

                <DataTable
                    value={teacherListQuery.data}//(teacherListQuery.data?.length === 0 || teacherListQuery.data === undefined) ? teacherOnExcel : 
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={'list_empty'}
                >
                    {
                        teacherOnExcel.length === 0 &&
                        <Column
                            alignHeader='center'
                            headerStyle={{
                                background: 'var(--bluegray-100)',
                                color: 'var(--bluegray-900)',
                                whiteSpace: 'nowrap',
                            }}
                            header={'Lựa chọn'}
                            body={renderActions}
                        />
                    }

                    {fields.map((field, index) => <Column
                        key={index}
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--bluegray-100)',
                            color: 'var(--bluegray-900)',
                            whiteSpace: 'nowrap',
                        }}
                        field={field.code}
                        header={field.field}
                    />)}


                </DataTable>
                <div className='flex align-items-center justify-content-between bg-white px-3 py-2'>
                    <Dropdown
                        id='date_created_filter'
                        value={DropdownValue[0].code}
                        optionValue='code'
                        onChange={(sortCode) => {

                        }}
                        options={DropdownValue}
                    />

                    <Paginator
                        className='border-noround p-0'
                    />

                </div>
            </div>
            <Form
                type={setlected?.type || "detail"}
                onSuccess={() => teacherListQuery.refetch()}
                data={setlected?.data}
                title={`${setlected?.type === "detail" ?
                    `Thông tin ${key} ${setlected?.data?.name || ""}`
                    : setlected?.type === "create" ?
                        `Thêm ${key} mới` :
                        `Chỉnh sửa thông tin ${key} ${setlected?.data?.name || ""}`}`}
                ref={formRef} />


        </div>
    )
}

export default Page