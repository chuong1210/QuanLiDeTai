"use client"
import XLSX from "@/assets/helpers/XLSX";
import { InputFile } from "@/resources/components/form";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaInfoCircle } from 'react-icons/fa';
import { FormRefType, TypeSelected } from "@/assets/types/form";
import * as request from "@/assets/helpers/request"
import { ConfirmModalRefType } from "@/assets/types/modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import API from "@/assets/configs/api";
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


export default function Page() {

    const fieldsDefault = [{
        maSo: '2001221382', name: "Trần Vinh Hiển",
        myClass: '13DHTH08', email: "vinhhien12z@gmail.com",
        phoneNumber: "0344197279", subjectName: "Kỹ thuật phần mềm"
    }];

    const [ThesisOnExcel, setThesisOnExcel] = useState<ThesisType[]>([])
    const onAddStudentExcel = (data: ThesisType[]) => {
        console.log(data)
    }

    return (
        <>
            <div>render danh sách đề tài ở đây</div>
            {/* <h3>Thực hiện thêm {key} vào đợt đăng kí Khóa luận</h3> */}
            <div >
                <Button className="my-3" onClick={() => XLSX.handleExportFile(fieldsDefault, "FilestudentExample")}>Export fie mẫu</Button>
                <h3>chose file</h3>
                <InputFile
                    accept='.xlsx ,.xls'
                    id="importFile"
                    multiple={true}
                    onChange={(e) => {
                        XLSX.handleImportFile(e, (data) => {
                            data.map((item: any, index: number) => {
                                if (item.gvhd === undefined && item[index - 1]) {
                                    item.gvhd === item[index - 1].gvhd
                                    item.tendetai === item[index - 1].tendetai
                                }
                                return item
                            })
                            console.log(data)
                            setThesisOnExcel(data)
                        })
                    }}
                    onRemove={() => {
                        setThesisOnExcel([])
                    }}
                    onSubmitFile={() => {
                        onAddStudentExcel(ThesisOnExcel)
                    }}
                />
            </div>
            <DataTable
                value={ThesisOnExcel}
                rowHover={true}
                stripedRows={true}
                showGridlines={true}
                emptyMessage={'list_empty'}
            >
                {
                    ThesisOnExcel.length === 0 &&
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--bluegray-100)',
                            color: 'var(--bluegray-900)',
                            whiteSpace: 'nowrap',
                        }}
                        header={'Lựa chọn'}
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
        </>

    )
}
