import { FormRefType, FormType } from '@/assets/types/form';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import * as request from "@/assets/helpers/request"

import { fields, key } from './page';
import { Button } from 'primereact/button';
import XLSX from '@/assets/helpers/XLSX';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import API from '@/assets/configs/api';
import { toast } from 'react-toastify';
import { InputFile } from '@/resources/components/form';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaInfoCircle } from 'react-icons/fa';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { MetaType } from '@/assets/types/request';
import { Loader } from '@/resources/components/UI';
import { isValidEmail, isValidPhoneNumber, trimObjectProperties } from '@/assets/helpers/string';
import { CheckE } from '@/assets/configs/general';

// const fieldsDefault = [{
//     code: '2001221382', name: "Trần Vinh Hiển",
//     myClass: '13DHTH08', email: "vinhhien12z@gmail.com",
//     phoneNumber: "0344197279", subjectName: "Kỹ thuật phần mềm",
//     departmentName: "Công nghệ thông tin"
// }];
const fieldsDefault = [{
    "Mã Số": '2001221382', "Họ Tên": "Trần Vinh Hiển",
    "Lớp": '13DHTH08', "Email": "vinhhien12z@gmail.com",
    "Số Điện Thoại": "0344197279", "Chuyên Ngành": "Kỹ thuật phần mềm",
    "Khoa": "Công nghệ thông tin"
}];

const FormInsert = forwardRef<any, FormType<any>>(({ title, type, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const [studentOnExcel, setStudentOnExcel] = useState<StudentType[]>([])
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);

    const show = (data?: StudentType) => {
        setVisible(true);
    };


    const close = () => {
        setVisible(false);
        setStudentOnExcel([])
    };

    useImperativeHandle(ref, () => ({
        show,
        close
    }));
    const SubjectsQuery = useQuery<SubjectType[], AxiosError<ResponseType>>({
        // enabled: false,
        // refetchOnWindowFocus: false,
        queryKey: ['list-Subject'],
        queryFn: async () => {
            const response: any = await request.get<SubjectType[]>(API.subjects.getAllNoParams);
            // console.log(response)
            return response.data?.result || [];
        },
    });

    const StudentListMutationInsert = useMutation<any, AxiosError<ResponseType>, StudentType[]>({
        mutationFn: (data) => {
            return request.post(`${API.students.insert_from_excel}`, { students: data });
        },
    });
    const onAddStudentExcel = (data: StudentType[]) => {

        const newData = data?.map((item: any) => {
            delete item.STT;

            return trimObjectProperties({
                ...item,
                // code: item.maSo.toString(),
                chucVu: "HỌC SINH",
                user_id: "",
            })
        })
        // console.log(newData)
        StudentListMutationInsert.mutate(newData, {
            onSuccess: (data) => {
                //StudentListQuery.refetch();
                close();
                onSuccess?.(data);
                toast.success("Thêm thành công");
            },
        })
    }
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setMeta({
            currentPage: event.page,
            hasNextPage: false,
            hasPreviousPage: false,
            limit: event.rows,
            totalPages: event.pageCount,
        });
        //      paramsRef.current = { page: Math.ceil((event.first) / event.rows) + 1, limit: event.rows, orderBy: "id", orderDirection: "ASC", }
        setMeta(e => ({ ...e, limit: event.rows }))
        //        StudentListQuery.refetch();
    };

    const customCellRenderer = (rowData: any, fieldCode: string) => {
        const cellValue = rowData[fieldCode]; // Lấy giá trị của ô hiện tại dựa vào `fieldCode`
        if (cellValue === CheckE.ERROR) {
            return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                    {cellValue}
                </span>
            );
        }
        return cellValue;
    };
    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '90vw', minHeight: "80vh" }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            {StudentListMutationInsert.isPending && <Loader />}
            <>
                <h3>Thực hiện thêm {key} vào đợt đăng kí Khóa luận</h3>
                <div >
                    <Button className="my-3" onClick={() => XLSX.handleExportFile(fieldsDefault, "FilestudentExample")}>Export fie mẫu</Button>
                    {/* <Button className="my-3" onClick={() => ExcelWithDropList.createExcelWithDropList(fieldsDefault, ["Option 1", "Option 2", "Option 3"], "FilestudentExample")} >Export fie mẫu</Button> */}
                    <h3>chose file</h3>
                    <InputFile
                        accept='.xlsx ,.xls'
                        id="importFile"
                        multiple={true}
                        onChange={(e) => {
                            XLSX.handleImportFile(e, (data) => {
                                setStudentOnExcel(data?.map((row: any) => {
                                    const subjectNames = SubjectsQuery?.data?.map((vl) => vl.name);
                                    let Dulieu: StudentType = {
                                        code: row["Mã Số"],
                                        name: row["Họ Tên"],
                                        myClass: row["Lớp"],
                                        email: isValidEmail(row["Email"].trim()) ? row["Email"] : CheckE.ERROR,
                                        phoneNumber: isValidPhoneNumber(row["Số Điện Thoại"].trim()) ? row["Số Điện Thoại"] : CheckE.ERROR,
                                        subjectName: subjectNames?.includes(row["Chuyên Ngành"].trim()) ? row["Chuyên Ngành"] : CheckE.ERROR,
                                        departmentName: row["Khoa"],
                                        subjectId: SubjectsQuery?.data?.find(subj => subj?.name === row["Chuyên Ngành"].trim())?.id
                                    }
                                    return Dulieu
                                }))
                            })
                        }}
                        onRemove={() => {
                            setStudentOnExcel([])
                        }}
                        onSubmitFile={() => {
                            onAddStudentExcel(studentOnExcel)
                        }}
                    />
                </div>
                <DataTable
                    value={studentOnExcel}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={'list_empty'}
                >


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
                        body={(dulieu) => customCellRenderer(dulieu, field.code)}
                    />)}


                </DataTable>

            </>
        </Dialog>
    )
})
FormInsert.displayName = `forwardRefInSert`
export default FormInsert
