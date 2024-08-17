"use client"
import XLSX from "@/assets/helpers/XLSX";
import { InputDate, InputFile } from "@/resources/components/form";
import { Loader } from "@/resources/components/UI";
import { Dropdown } from "@/resources/components/form";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
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
import { MetaType, ParamType } from "@/assets/types/request";
import FormInsert from "./formInsert";
export const key = "giảng viên"
// chờ có file hoàng chỉnh rồi mới làm tiếp
interface fieldsType {
    field: string;
    code: 'code' | "name" | "degree" | "email" | "phoneNumber" | "subjectName" | "position" | 'departmentName';
    typeInput: string
}
export const fields: fieldsType[] = [
    { field: "msgv", code: "code", typeInput: "text" },
    { field: "Tên", code: "name", typeInput: "text" },
    { field: "Email", code: "email", typeInput: "text" },
    { field: "Số điện thoại", code: "phoneNumber", typeInput: "text" },
    { field: "Học vị", code: "degree", typeInput: "null" },
    { field: "Chức vụ", code: "position", typeInput: "null" },
    { field: "Bộ môn", code: "subjectName", typeInput: "null" },
    // { field: "Chuyên ngành", code: "subjectName", typeInput: "text" },
]

function Page() {

    const [setlected, setSelected] = useState<TypeSelected<TeacherType>>()
    const formRef = useRef<FormRefType<TeacherType>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const formInsert = useRef<any>();
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const paramsRef = useRef<ParamType>({
        page: meta.currentPage,
        limit: meta.limit,
        orderBy: 'id',
        orderDirection: 'ASC',
    });

    const teacherListQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response = await request.get<TeacherType[]>(`${API.teachers.getAll}`, {
                params: paramsRef.current
            });
            let responseData = response.data.result.responses ?? [];
            if (responseData) {

                responseData = responseData.map((teacher: any) => {
                    //teacher.degree = teacher.degree.split(",");
                    teacher.position = teacher.position.join(" ,");
                    if (teacher.subjects) {
                        teacher.subjectName = teacher.subjects.name
                        teacher.departmentName = teacher.subjects.departments.name
                    }
                    return teacher
                })
            }

            if (response.data.result.page && response.data.result.totalPages) {
                setMeta({
                    currentPage: response.data.result.page,
                    hasNextPage: response.data.result.page + 1 === response.data.result.totalPages ? false : true,
                    hasPreviousPage: response.data.result.page - 1 === 0 ? false : true,
                    limit: paramsRef.current.limit,
                    totalPages: response.data.result.totalPages,
                });

            }
            // console.log("reload", responseData)

            return responseData || [];
        },
    });

    const teacherListMutation = useMutation<any, AxiosError<ResponseType>, TeacherType>({
        mutationFn: (data) => {
            return request.remove(`${API.teachers.delete}`, { data: [data.id] });
        },
    });
    // const teacherListMutationInsert = useMutation<any, AxiosError<ResponseType>, TeacherType[]>({
    //     mutationFn: (data) => {
    //         return request.post(`${API.teachers.insert}`, { teachers: data });
    //     },
    // });

    const renderActions = (data: TeacherType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                    formRef.current?.show?.(data);
                    setSelected({ type: "detail", data: data })
                }} />
                {
                    cookies.get<roleE>(ROLE_USER)?.includes(roleE.giaovu) && (
                        <>
                            {/* <i
                                className='pi pi-pencil hover:text-primary cursor-pointer'
                                onClick={() => {
                                    formRef.current?.show?.(data);
                                    setSelected({ type: "edit", data: data })
                                }}
                            /> */}
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

    const onRemove = (data: TeacherType) => {
        teacherListMutation.mutate(data, {
            onSuccess: () => {
                teacherListQuery.refetch();
                toast.success("Xóa thành công");
            },
        });
    }
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        if (paramsRef.current.limit === event.rows && paramsRef.current.page - 1 === event.page) return
        paramsRef.current = { page: Math.ceil((event.first) / event.rows) + 1, limit: event.rows, orderBy: "id", orderDirection: "ASC", }
        setMeta(e => ({ ...e, limit: event.rows }))
        teacherListQuery.refetch();
    };
    return (
        <div>{teacherListQuery.isFetching || teacherListMutation.isPending && <Loader />}
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />
            <h2 className="mb-4">Danh sách {key}</h2>
            {
                cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.giaovu) && (
                    <>
                        <Button onClick={() => {
                            formInsert.current.show(true);
                        }}>Thêm {key} excel</Button>
                        <p></p>
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
                )}

            <div className="my-3">

                <DataTable
                    value={teacherListQuery.data}//(teacherListQuery.data?.length === 0 || teacherListQuery.data === undefined) ? teacherOnExcel : 
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
                        body={renderActions}
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
                        first={meta.currentPage * meta.limit - 1}
                        rows={meta.limit}
                        //pageLinkSize={meta.limit}
                        totalRecords={meta.limit * meta.totalPages}
                        rowsPerPageOptions={request.ROW_PER_PAGE}
                        onPageChange={onPageChange}
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
            <FormInsert
                type="detail"
                title={`Thực hiện thêm ${key} vào hệ thống`}
                onSuccess={() => { teacherListQuery.refetch() }}
                ref={formInsert}
            />

        </div>
    )
}

export default Page