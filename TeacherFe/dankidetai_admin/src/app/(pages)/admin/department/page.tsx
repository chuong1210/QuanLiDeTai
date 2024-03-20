"use client"
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

export const key = "ngành"
function Page() {
    const fieldss = ["id", "name"]
    const [setlected, setSelected] = useState<TypeSelected<DepartmentType>>()
    const formRef = useRef<FormRefType<DepartmentType>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);


    const DeparmentQuery = useQuery<DepartmentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response = await request.get<DepartmentType[]>(`${API.department.getAll}`);
            //console.log(response)
            const responseData = response.data ?? [];
            return responseData || [];
        },
    });

    const DeparmentMutation = useMutation<any, AxiosError<ResponseType>, DepartmentType>({
        mutationFn: (data) => {
            return request.remove(`${API.department.delete}`, { data: [data.id] });
        },
    });


    const renderActions = (data: DepartmentType) => {
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

    const onRemove = (data: DepartmentType) => {
        DeparmentMutation.mutate(data, {
            onSuccess: () => {
                DeparmentQuery.refetch();

                toast.success("Xóa thành công");
            },
        });
    }
    return (
        <div>
            <Loader show={DeparmentQuery.isFetching || DeparmentMutation.isPending} />
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />
            <h3>Quản lý {key}</h3>

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
            <div >

                <DataTable
                    value={DeparmentQuery.data}
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
                    {fieldss.map((fields, index) => <Column
                        key={index}
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