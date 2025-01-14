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
import { Loader } from '@/resources/components/UI';
import { trimObjectProperties } from '@/assets/helpers/string';
import { ResearchParams } from './form';

const fieldsDefault = [{
    name: '', note: "",
    minMembers: 1, maxMembers: 4,
    stage: 1, schoolYear: "",
    detail: ""
}];

const FormInsert = forwardRef<any, FormType<any>>(({ title, type, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const [studentOnExcel, setStudentOnExcel] = useState<ResearchParams[]>([])

    const show = (data?: ResearchParams) => {
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
    const ReSearchListMutationInsert = useMutation<any, AxiosError<ResponseType>, ResearchParams[]>({
        mutationFn: (data) => {
            return request.post(API.reSearch.insert, { researches: data })
        },
    });
    const onAddReSearchExcel = (data: ResearchParams[]) => {
        const newData = data?.map((item: ResearchParams) => {
            return { ...item, instructorsIds: [] }
        })
        // ReSearchListMutationInsert.mutate(newData, {
        //     onSuccess: (data) => {
        //         //StudentListQuery.refetch();
        //         close();
        //         onSuccess?.(data);
        //         toast.success("Thêm thành công");
        //     },
        // })
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
            {ReSearchListMutationInsert.isPending && <Loader />}
            <>

                <h3>Thực hiện thêm {key} vào đợt đăng kí Khóa luận</h3>
                <div >
                    <Button className="my-3" onClick={() => XLSX.handleExportFile(fieldsDefault, "FileReSearch")}>Export fie mẫu</Button>
                    <h3>chose file</h3>
                    <InputFile
                        accept='.xlsx ,.xls'
                        id="importFile"
                        multiple={true}
                        onChange={(e) => {
                            XLSX.handleImportFile(e, (data) => {
                                setStudentOnExcel(data)
                            })
                        }}
                        onRemove={() => {
                            setStudentOnExcel([])
                        }}
                        onSubmitFile={() => {
                            onAddReSearchExcel(studentOnExcel)
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
                    />)}


                </DataTable>

            </>
        </Dialog>
    )
})
FormInsert.displayName = `forwardRefInSert`
export default FormInsert
