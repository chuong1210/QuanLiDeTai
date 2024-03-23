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
import { cookies } from "@/assets/helpers";
import { ROLE_USER } from "@/assets/configs/request";
export const key = "học sinh"
// chờ có file hoàng chỉnh rồi mới làm tiếp
interface fieldsType {
    field: string;
    code: 'maSo' | "name" | "myClass" | "email" | "phoneNumber" | "subjectName";
    typeInput: string
}
export const fields: fieldsType[] = [
    { field: "mssv", code: "maSo", typeInput: "text" },
    { field: "Tên", code: "name", typeInput: "text" },
    { field: "Lớp", code: "myClass", typeInput: "text" },
    { field: "Email", code: "email", typeInput: "text" },
    { field: "Số điện thoại", code: "phoneNumber", typeInput: "text" },
    { field: "Chuyên ngành", code: "subjectName", typeInput: "drop" }
]

function Page() {

    const [studentOnExcel, setStudentOnExcel] = useState<StudentType[]>([])
    const [setlected, setSelected] = useState<TypeSelected<StudentType>>()
    const formRef = useRef<FormRefType<StudentType>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);

    const StudentListQuery = useQuery<StudentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response = await request.get<StudentType[]>(`${API.students.getAll}`);
            let responseData = response.data ?? [];
            if (responseData) {
                responseData = responseData.map((student: any) => {
                    return { ...student, subjectName: student.subjects.name }
                })
            }
            return responseData || [];
        },
    });

    const StudentListMutation = useMutation<any, AxiosError<ResponseType>, StudentType>({
        mutationFn: (data) => {
            return request.remove(`${API.students.delete}`, { data: [data.id] });
        },
    });


    const renderActions = (data: StudentType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                    formRef.current?.show?.(data);
                    setSelected({ type: "detail", data: data })
                }} />
                {
                    cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.admin) && (
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

    const onRemove = (data: StudentType) => {
        StudentListMutation.mutate(data, {
            onSuccess: () => {
                setStudentOnExcel([])
                StudentListQuery.refetch();
                toast.success("Xóa thành công");
            },
        });
    }
    return (
        <div>
            {StudentListQuery.isFetching || StudentListMutation.isPending && <Loader />}
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />
            {
                cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.admin) && <>
                    <h3>Thực hiện thêm {key} vào đợt đăng kí Khóa luận</h3>

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
                </>
            }

            <div className="my-3">

                <DataTable
                    value={(StudentListQuery.data?.length === 0 || StudentListQuery.data === undefined) ? studentOnExcel : StudentListQuery.data}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={'list_empty'}
                >
                    {
                        studentOnExcel.length === 0 &&
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
                data={setlected?.data}
                onSuccess={() => StudentListQuery.refetch()}
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