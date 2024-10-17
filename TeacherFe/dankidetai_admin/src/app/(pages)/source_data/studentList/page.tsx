"use client"
import XLSX from "@/assets/helpers/XLSX";
import { InputDate, InputFile } from "@/resources/components/form";
import { Loader } from "@/resources/components/UI";
import { Dropdown } from "@/resources/components/form";
import { Button } from "primereact/button";
import { Column, ColumnSortEvent } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaInfoCircle } from 'react-icons/fa';
import { FormRefType, TypeSelected } from "@/assets/types/form";
import * as request from "@/assets/helpers/request"
import { ConfirmModalRefType } from "@/assets/types/modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import API from "@/assets/configs/api";
import { DropdownValue, roleE } from "@/assets/configs/general";
import Confirm from "@/resources/components/UI/Confirm";
import { cookies } from "@/assets/helpers";
import { ROLE_USER } from "@/assets/configs/request";
import { MetaType, ParamType } from "@/assets/types/request";
export const key = "học sinh"
// chờ có file hoàng chỉnh rồi mới làm tiếp
interface fieldsType {
    field: string;
    code: 'code' | "name" | "myClass" | "email" | "phoneNumber" | "subject.name";
    typeInput: string
}
export const fields: fieldsType[] = [
    { field: "mssv", code: "code", typeInput: "text" },
    { field: "Tên", code: "name", typeInput: "text" },
    { field: "Lớp", code: "myClass", typeInput: "text" },
    { field: "Email", code: "email", typeInput: "text" },
    { field: "Số điện thoại", code: "phoneNumber", typeInput: "text" },
    { field: "Chuyên ngành", code: "subject.name", typeInput: "drop" }
]

function Page() {

    const [setlected, setSelected] = useState<TypeSelected<StudentType>>()
    const formRef = useRef<FormRefType<StudentType>>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const paramsRef = useRef<ParamType>({
        page: meta.currentPage,
        limit: meta.limit,
        orderBy: 'id',
        orderDirection: 'ASC',
    });

    const StudentListQuery = useQuery<StudentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response = await request.get<StudentType[]>(`${API.students.getAll}`, {
                params: paramsRef.current
            });
            let responseData = response.data.result.responses ?? [];
            if (responseData.length > 0) {
                responseData = responseData.map((student: any) => {
                    return { ...student, subjectName: student.subject.name }
                })
            }
            if (response.data.result.currentPage && response.data.result.totalPages) {
                setMeta({
                    currentPage: response.data.result.currentPage,
                    hasNextPage: response.data.result.currentPage + 1 === response.data.result.totalPages ? false : true,
                    hasPreviousPage: response.data.result.currentPage - 1 === 0 ? false : true,
                    limit: paramsRef.current.limit,
                    totalPages: response.data.result.totalPages,
                });

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

            </div>
        );
    };


    const onPageChange = (event: PaginatorPageChangeEvent) => {
        if (paramsRef.current.limit === event.rows && paramsRef.current.page - 1 === event.page) return
        paramsRef.current = { page: Math.ceil((event.first) / event.rows) + 1, limit: event.rows, orderBy: "id", orderDirection: "ASC", }
        setMeta(e => ({ ...e, limit: event.rows }))
        StudentListQuery.refetch();
    };

    return (
        <div>
            {StudentListQuery.isFetching || StudentListMutation.isPending && <Loader />}

            <h2>Danh sách sinh viên của hệ thống</h2>

            <div className="my-3">

                <DataTable

                    value={StudentListQuery.data}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}

                    emptyMessage={'Danh sách rỗng'}
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
                        sortable
                        // sortFunction={sortFunction}
                        //onFilterApplyClick={(e) => { console.log(e) }}
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

        </div>
    )
}

export default Page