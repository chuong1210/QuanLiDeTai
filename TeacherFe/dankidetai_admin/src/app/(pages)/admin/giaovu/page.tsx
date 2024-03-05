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
interface typeSelected {
    student: StudentType,
    type: "detail" | "edit" | "create"

}

function page() {

    const fields = [{
        STT: 1, MSSV: '20012213821111111111', Name: "Trần Vinh Hiển",
        Class: '13DHTH08', DayOfBirth: "19/12/2004", Email: "vinhhien12z@gmail.com",
        PhoneNumber: "0344197279"
    }, {
        STT: 1, MSSV: '2001221382', Name: "Trần Vinh Hiển",
        Class: '13DHTH08', DayOfBirth: "19/12/2004", Email: "vinhhien12z@gmail.com",
        PhoneNumber: "0344197279"
    }, {
        STT: 1, MSSV: '2001221382', Name: "Trần Vinh Hiển",
        Class: '13DHTH08', DayOfBirth: "19/12/2004", Email: "vinhhien12z@gmail.com",
        PhoneNumber: "0344197279"
    }, {
        STT: 1, MSSV: '2001221382', Name: "Trần Vinh Hiển",
        Class: '13DHTH08', DayOfBirth: "19/12/2004", Email: "vinhhien12z@gmail.com",
        PhoneNumber: "0344197279"
    }, {
        STT: 1, MSSV: '2001221382', Name: "Trần Vinh Hiển",
        Class: '13DHTH08', DayOfBirth: "19/12/2004", Email: "vinhhien12z@gmail.com",
        PhoneNumber: "0344197279"
    }];
    const fieldss = ["STT", "MSSV", "Name", "Class", "DayOfBirth", "Email", "PhoneNumber"]
    const [sinhVien, setSinhVien] = useState<StudentType[]>([])
    const [setlected, setSelected] = useState<typeSelected>()
    const formRef = useRef<StudentFormRefType>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);


    const StudentQuery = useQuery<StudentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['student', 'list'],
        queryFn: async () => {
            const response = await request.get<StudentType[]>(`${ROUTER.admin}`);
            return response.data.data || [];
        },
    });

    const StudentMutation = useMutation<any, AxiosError<ResponseType>, StudentType>({
        mutationFn: (data) => {
            return request.remove(`${ROUTER.admin}`, { params: { id: data.id } });
        },
    });


    const renderActions = (data: StudentType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                    formRef.current?.show?.(data);
                    console.log("hi")
                    setSelected({ type: "detail", student: data })
                }} />
                <i
                    className='pi pi-pencil hover:text-primary cursor-pointer'
                    onClick={() => {
                        formRef.current?.show?.(data);
                        //console.log(setlected)
                        setSelected({ type: "edit", student: data })
                        //console.log(setlected)
                    }}
                />
                <i
                    className='pi pi-trash hover:text-red-600 cursor-pointer'
                    onClick={(e) => {
                        confirmModalRef.current?.show?.(e, data, `Bạn có chắc muốn xóa ${data.Name}`);
                    }}
                />
            </div>
        );
    };

    const onRemove = (data: StudentType) => {
        StudentMutation.mutate(data, {
            onSuccess: () => {
                StudentQuery.refetch();

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
            {/* <Loader show={StudentQuery.isFetching || StudentMutation.isPending} /> */}
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />
            <h3>Thực hiện thêm sinh viên vào đợt đăng kí Khóa luận</h3>
            <div >

                <Button className="my-3" onClick={() => XLSX.handleExportFile(fields, "FileSinhVienExample")}>Export fie mẫu</Button>
                <InputFile
                    accept='.xlsx ,.xls'
                    id="importFile"
                    multiple={true}
                    onChange={(e) => {
                        XLSX.handleImportFile(e, (data) => {
                            setSinhVien(data)
                        })
                    }}
                    onRemove={() => {
                        setSinhVien([])
                    }}
                    onSubmitFile={() => request.post("/giaovu/nhandssv", { sinhVien })}
                />
            </div>
            <div className='flex align-items-center justify-content-between bg-white h-4rem px-3 border-round-lg shadow-3'>
                <p className='text-xl font-semibold'>{"Thêm mới sinh viên"}</p>
                <Button
                    label={"Thêm sinh viên"}
                    icon='pi pi-plus'
                    size='small'
                    onClick={() => {
                        formRef.current?.show?.();
                        setSelected(undefined);
                    }}
                />
            </div>
            <div className='my-3'>

                <DataTable
                    value={StudentQuery.data}
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
                data={setlected?.student}
                onSuccess={(data) => StudentQuery.refetch()}
                title={`${setlected?.type === "detail" ? "T" : "Chỉnh sửa t"}hông tin sinh viên :${setlected?.student.Name}`}
                ref={formRef} />

        </div>
    )
}

export default page