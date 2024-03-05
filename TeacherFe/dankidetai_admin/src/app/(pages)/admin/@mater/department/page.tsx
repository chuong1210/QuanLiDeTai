"use client"
// import React, {  useState } from 'react'
import XLSX from "@/assets/helpers/XLSX";
import { Loader } from "@/resources/components/UI";
import { Dropdown, InputFile } from "@/resources/components/form";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaInfoCircle } from 'react-icons/fa';
import FormDetail, { StudentFormRefType } from "./form";
import Form from "./form";
import * as request from "@/assets/helpers/request"
import Confirm from "@/resources/components/UI/Confirm";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ROUTER from "@/assets/configs/routers";
import API from "@/assets/configs/api";
interface typeSelected {
    deparment?: DepartmentType,
    type: "detail" | "edit" | "create"

}

function page() {


    const fieldss = ["id", "name"]
    const [setlected, setSelected] = useState<typeSelected>()
    const formRef = useRef<StudentFormRefType>(null);
    const [temp, setTemp] = useState({ name: "cntt", id: 1 })
    const confirmModalRef = useRef<ConfirmModalRefType>(null);


    const DeparmentQuery = useQuery<DepartmentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['deparment', 'list'],
        queryFn: async () => {
            const response = await request.get<DepartmentType[]>(`${API.department.delete}`);
            return response.data.data || [];
        },
    });

    const DeparmentMutation = useMutation<any, AxiosError<ResponseType>, DepartmentType>({
        mutationFn: (data) => {
            return request.remove(`${API.department.delete}`, { params: { id: data.id } });
        },
    });


    const renderActions = (data: DepartmentType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                    formRef.current?.show?.(data);
                    console.log("hi")
                    setSelected({ type: "detail", deparment: data })
                }} />
                <i
                    className='pi pi-pencil hover:text-primary cursor-pointer'
                    onClick={() => {
                        formRef.current?.show?.(data);
                        //console.log(setlected)
                        setSelected({ type: "edit", deparment: data })
                        //console.log(setlected)
                    }}
                />
                <i
                    className='pi pi-trash hover:text-red-600 cursor-pointer'
                    onClick={(e) => {
                        confirmModalRef.current?.show?.(e, data, `Bạn có chắc muốn xóa ${data.name}`);
                    }}
                />
            </div>
        );
    };

    const onRemove = (data: DepartmentType) => {
        DeparmentMutation.mutate(data, {
            onSuccess: () => {
                DeparmentQuery.refetch();

                toast.success("Xóa thành công");
            },
        });
    }

    const DropdownValue = [
        {
            label: 'Trên xuống dưới',
            value: 0,
            name: 'DateCreated',
            code: 'TopToDown',
        },
        {
            label: 'Dưới lên trên',
            value: 1,
            name: 'DateCreated',
            code: 'DownToTop',
        },
    ]

    return (
        <div>
            <Loader show={DeparmentQuery.isFetching || DeparmentMutation.isPending} />
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />
            <h3>Quản lý Ngành</h3>

            <Button
                label={"Thêm ngành mới"}
                icon='pi pi-plus'
                size='small'
                className="my-3"
                onClick={() => {
                    formRef.current?.show?.();
                    setSelected({ type: "create", deparment: undefined })
                }}
            />
            <div >

                <DataTable
                    value={[temp]}
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
                        header={'lua chon'}
                        body={renderActions}
                    />
                    {fieldss.map(fields => <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--bluegray-100)',
                            color: 'var(--bluegray-900)',
                            whiteSpace: 'nowrap',
                        }}
                        field={fields}
                        header={fields}
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
                data={setlected?.deparment}
                onSuccess={(data) => DeparmentQuery.refetch()}
                title={`${setlected?.type === "detail" ? "T" : setlected?.type === "create" ? "Thêm mới t" : "Chỉnh sửa t"}hông tin Ngành :${setlected?.deparment?.name || ""}`}
                ref={formRef} />

        </div>
    )
}

export default page