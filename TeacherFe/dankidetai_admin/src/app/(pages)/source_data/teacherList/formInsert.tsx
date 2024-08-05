import { FormRefType, FormType } from '@/assets/types/form';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import * as request from "@/assets/helpers/request"

import { fields, key } from './page';
import { Button } from 'primereact/button';
import XLSX from '@/assets/helpers/XLSX';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import API from '@/assets/configs/api';
import { toast } from 'react-toastify';
import { InputFile } from '@/resources/components/form';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaInfoCircle } from 'react-icons/fa';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { MetaType } from '@/assets/types/request';
import { trimObjectProperties } from '@/assets/helpers/string';
import { Loader } from '@/resources/components/UI';

const fieldsDefault = [{
    maSo: '200112', name: "Trần Văn Thọ",
    email: "vinhhien12z@gmail.com", phoneNumber: "0344197279",
    hocVi: 'Thạc sĩ',
    subjectName: "Kỹ thuật phần mềm",
    departmentName: "Công nghệ thông tin"
}];

/*
{
    "teachers":[
        {
            "maSo" : "99932192222",
            "name" : "Trần Văn Thọ",
            "hocVi" : "Thạc sĩ",
            "email" : "tranvantho@huit.edu.vn",
            "phoneNumber" : "09123456789", 
            "chucVu" : "GIÁNG VIÊN",
            "user_id" : "",
            "departmentName" : "Công nghệ thông tin",
            "subjectName" : "Kỹ thuật phần mềm"
        },
        {
            "maSo" : "99993123333",
            "name" : "Đặng Trần Khánh",
            "hocVi" : "Phó Giáo Sư",
            "email" : "dangtrankhanh@huit.edu.vn",
            "phoneNumber" : "09123456789",
            "chucVu" : "GIÁNG VIÊN",
            "user_id" : "",
            "departmentName" : "Công nghệ thông tin",
            "subjectName" : "Khoa học dữ liệu & Trí tuệ nhân tạo"
        }
    ]
}


*/
const FormInsert = forwardRef<any, FormType<any>>(({ title, type, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const [teachertOnExcel, setTeachertOnExcel] = useState<TeacherType[]>([])
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);

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




    const onAddTeacherExcel = (data: TeacherType[]) => {
        const newData = data.map((item: any) => {
            delete item.STT;
            return trimObjectProperties({
                ...item,
                maSo: item.maSo.toString().trim(),
                phoneNumber: item.phoneNumber.toString(),
                user_id: "",
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

                <h3>Thực hiện thêm {key} vào đợt đăng kí Khóa luận</h3>
                <div >
                    <Button className="my-3" onClick={() => XLSX.handleExportFile(fieldsDefault, "FilestudentExample")}>Export fie mẫu</Button>
                    <h3>chose file</h3>
                    <InputFile
                        accept='.xlsx ,.xls'
                        id="importFile"
                        multiple={true}
                        onChange={(e) => {
                            XLSX.handleImportFile(e, (data) => {
                                setTeachertOnExcel(data.map((item: any) => { return { ...item, chucVu: "GIẢNG VIÊN" } }))
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
                    />)}


                </DataTable>
            </>
        </Dialog>
    )
})
FormInsert.displayName = `forwardRefInSert`
export default FormInsert
