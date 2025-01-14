import { FormType } from '@/assets/types/form';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import * as request from "@/assets/helpers/request"

import { key } from './page';
import { Button } from 'primereact/button';
import XLSX from '@/assets/helpers/XLSX';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import API from '@/assets/configs/api';
import { toast } from 'react-toastify';
import { InputFile } from '@/resources/components/form';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { isValidEmail, isValidPhoneNumber, trimObjectProperties } from '@/assets/helpers/string';
import { Loader } from '@/resources/components/UI';
import { CheckE } from '@/assets/configs/general';

const fieldsDefault = [{
    "Mã Số": '200112', "Họ Tên": "Trần Văn Thọ",
    "Email": "vinhhien12z@gmail.com",
    "Số Điện Thoại": "0344197279",
    "Học Vị": 'Thạc sĩ',
    "Chuyên Ngành": "Kỹ thuật phần mềm",
    "Khoa": "Công nghệ thông tin"
}];
const fields = [
    { field: "Mã Số", code: "code", typeInput: "text" },
    { field: "Tên", code: "name", typeInput: "text" },
    { field: "Email", code: "email", typeInput: "text" },
    { field: "Số điện thoại", code: "phoneNumber", typeInput: "text" },
    { field: "Học vị", code: "degree", typeInput: "null" },
    { field: "Chức vụ", code: "position", typeInput: "null" },
    { field: "Chuyên Ngành", code: "subjectName", typeInput: "null" },
    { field: "Khoa", code: "departmentName", typeInput: "null" },
    // { field: "Chuyên ngành", code: "subjectName", typeInput: "text" },
]

const FormInsert = forwardRef<any, FormType<any>>(({ title, type, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const [teachertOnExcel, setTeachertOnExcel] = useState<TeacherType[]>([])

    const show = (data?: TeacherType) => {
        setVisible(true);
    };


    const close = () => {
        setVisible(false);
        setTeachertOnExcel([])
    };

    useImperativeHandle(ref, () => ({
        show,
        close
    }));
    const TeacherListMutationInsert = useMutation<any, AxiosError<ResponseType>, TeacherType[]>({
        mutationFn: (data) => {
            //console.log(data)
            return request.post(`${API.teachers.insert_from_excel}`, { teachers: data });
        },
    });
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
    const onAddTeacherExcel = (data: TeacherType[]) => {
        const newData = data?.map((item: any) => {
            delete item.STT;
            return trimObjectProperties({
                ...item,
                degree: item.degree,
                code: item.code.toString().trim(),
                phoneNumber: item.phoneNumber.toString(),
                position: [item.chucVu]

            })
        })
        TeacherListMutationInsert.mutate(newData, {
            onSuccess: (data) => {
                close();
                onSuccess?.(data);
                toast.success("Thêm thành công");
            },
        })
    }

    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '90vw', minHeight: "80vh" }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >

            {TeacherListMutationInsert.isPending && <Loader />}
            <>

                <h3>Thực hiện thêm {key} vào hệ thống</h3>
                <div >
                    <Button className="my-3" onClick={() => XLSX.handleExportFile(fieldsDefault, "FileTeacherExample")}>Export fie mẫu</Button>
                    {/* <h3>chose file</h3> */}
                    <InputFile
                        accept='.xlsx ,.xls'
                        id="importFile"
                        multiple={true}
                        onChange={(e) => {
                            XLSX.handleImportFile(e, (data) => {
                                setTeachertOnExcel(data?.map((row: any) => {
                                    const subjectNames = SubjectsQuery?.data?.map((vl) => vl.name);
                                    let Dulieu: any = {
                                        code: row["Mã Số"],
                                        name: row["Họ Tên"],
                                        degree: row["Học Vị"],
                                        email: isValidEmail(row["Email"].trim()) ? row["Email"] : CheckE.ERROR,
                                        phoneNumber: isValidPhoneNumber(row["Số Điện Thoại"].trim()) ? row["Số Điện Thoại"] : CheckE.ERROR,
                                        subjectName: subjectNames?.includes(row["Chuyên Ngành"].trim()) ? row["Chuyên Ngành"] : CheckE.ERROR,
                                        departmentName: row["Khoa"],
                                        position: ["GIẢNG VIÊN"],
                                        roleIds: ["4"],
                                        subjectId: SubjectsQuery?.data?.find(subj => subj?.name === row["Chuyên Ngành"].trim())?.id
                                    }

                                    return Dulieu
                                }))
                            })
                        }}
                        onRemove={() => {
                            setTeachertOnExcel([])
                        }}
                        onSubmitFile={() => {
                            onAddTeacherExcel(teachertOnExcel)
                        }}
                    />
                </div>
                <DataTable
                    value={teachertOnExcel}
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
