"use client"
// import React, {  useState } from 'react'
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
import Confirm from "@/resources/components/UI/Confirm";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import API from "@/assets/configs/api";
import { DropdownValue } from "@/assets/configs/general";
export const key = "học sinh"
// chờ có file hoàng chỉnh rồi mới làm tiếp
interface fieldsType {
    field: string;
    code: 'maSo' | "name" | "myClass" | "DOB" | "email" | "phoneNumber" | "subjectName";
    typeInput: string
}
export const fields: fieldsType[] = [
    { field: "mssv", code: "maSo", typeInput: "text" },
    { field: "Tên", code: "name", typeInput: "text" },
    { field: "Lớp", code: "myClass", typeInput: "text" },
    { field: "Ngày sinh", code: "DOB", typeInput: "date" },
    { field: "Email", code: "email", typeInput: "text" },
    { field: "Số điện thoại", code: "phoneNumber", typeInput: "text" },
    { field: "Chuyên ngành", code: "subjectName", typeInput: "text" }
]

function Page() {

    const fieldsDefault = [{
        STT: 1, maSo: '2001221382', name: "Trần Vinh Hiển",
        myClass: '13DHTH08', DOB: "2004-12-19", email: "vinhhien12z@gmail.com",
        phoneNumber: "0344197279", subjectName: "Kỹ thuật phần mềm"
    }];

    const [sinhVienOnExcel, setSinhVienOnExcel] = useState<StudentType[]>([])
    const [setlected, setSelected] = useState<TypeSelected<StudentType>>()
    const formRef = useRef<FormRefType<StudentType>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);

    const DeparmentQuery = useQuery<StudentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response = await request.get<StudentType[]>(`${API.subjects.getAll}`);
            //console.log(response)
            const responseData = response.data ?? [];
            return responseData || [];
        },
    });

    const DeparmentMutation = useMutation<any, AxiosError<ResponseType>, StudentType>({
        mutationFn: (data) => {
            return request.remove(`${API.subjects.delete}`, { data: [data.id] });
        },
    });


    const renderActions = (data: StudentType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                    formRef.current?.show?.(data);
                    setSelected({ type: "detail", data: data })
                }} />
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
            </div>
        );
    };

    const onRemove = (data: StudentType) => {
        DeparmentMutation.mutate(data, {
            onSuccess: () => {
                DeparmentQuery.refetch();

                toast.success("Xóa thành công");
            },
        });
    }
    return (
        <div>            {DeparmentQuery.isFetching || DeparmentMutation.isPending && <Loader />}

            <h3>Thực hiện thêm sinh viên vào đợt đăng kí Khóa luận</h3>
            <div >
                <Button className="my-3" onClick={() => XLSX.handleExportFile(fieldsDefault, "FileSinhVienExample")}>Export fie mẫu</Button>
                <InputFile
                    accept='.xlsx ,.xls'
                    id="importFile"
                    multiple={true}
                    onChange={(e) => {
                        XLSX.handleImportFile(e, (data) => {
                            console.log(data)
                            data = data.map((value: any) => {
                                const dob = new Date(value.DOB)
                                value.DOB = `${dob.getDate()}/${dob.getMonth()}/${dob.getFullYear()}`;
                                return value
                            })
                            setSinhVienOnExcel(data)
                        })
                    }}
                    onRemove={() => {
                        setSinhVienOnExcel([])
                    }}
                    onSubmitFile={() => {

                        //  console.log(new Date(sinhVienOnExcel[0].DOB || ""), typeof sinhVienOnExcel[1].DOB)
                    }}
                />
            </div>
            <div className="my-3">

                <DataTable
                    value={sinhVienOnExcel}
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
                        className='border-noround p-0'
                    />

                </div>
            </div>
            <Form
                type={setlected?.type || "detail"}
                data={setlected?.data}
                onSuccess={(data) => DeparmentQuery.refetch()}
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