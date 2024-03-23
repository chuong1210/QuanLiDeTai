"use client"
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
import { DropdownValue, roleE } from "@/assets/configs/general";
import { Skeleton } from "primereact/skeleton";
import { Loader } from "@/resources/components/UI";
import { useSelector } from "react-redux";
import { Rootstate } from "@/assets/redux/store";
import { ROLE_USER } from "@/assets/configs/request";
import { cookies } from "@/assets/helpers";


interface fieldsType {
    field: string;
    code: 'id' | "name" | "departments.name";
    typeInput: string
}
export const fields: fieldsType[] = [
    { field: "id", code: "id", typeInput: "text" },
    { field: "Tên", code: "name", typeInput: "text" },
    { field: "Ngành", code: "departments.name", typeInput: "text" }
]
export const key = "bộ môn"
function Page() {
    //const fieldss = ["id", "name", "departments.name"]
    const [setlected, setSelected] = useState<TypeSelected<SubjectType>>()
    const formRef = useRef<FormRefType<SubjectType>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const roles = useSelector((state: Rootstate) => state.role.role);


    const SubjectQuery = useQuery<SubjectType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response = await request.get<SubjectType[]>(`${API.subjects.getAll}`);
            return response.data || [];
        },
    });

    const SubjectMutation = useMutation<any, AxiosError<ResponseType>, SubjectType>({
        mutationFn: (data) => {
            return request.remove(`${API.subjects.delete}`, { data: [data.id] });
        },
    });


    const renderActions = (data: SubjectType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                    formRef.current?.show?.(data);
                    setSelected({ type: "detail", data: data })
                }} />
                {/* {roles.includes(roleE.admin) && */}
                {cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.admin) &&
                    (
                        <>
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
                        </>
                    )}
            </div>
        );
    };

    const onRemove = (data: SubjectType) => {
        SubjectMutation.mutate(data, {
            onSuccess: () => {
                SubjectQuery.refetch();

                toast.success("Xóa thành công");
            },
        });
    }
    return (
        <div>
            {SubjectQuery.isFetching || SubjectMutation.isPending && <Loader />}
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />

            {cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.admin) &&
                <>
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
                    <h3>Quản lý {key}</h3>
                </>
            }
            <div >

                <DataTable
                    value={SubjectQuery.data}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={'list_empty'}
                >
                    <Column
                        key={"options"}
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
                        body={(SubjectQuery.isLoading || SubjectMutation.isPending) && <Skeleton />}
                    />)}


                </DataTable>
                <div className='flex align-items-center justify-content-between bg-white px-3 py-2'>
                    <Dropdown
                        id='date_created_filter'
                        value={DropdownValue[0].code}
                        optionValue='code'
                        onChange={(sortCode) => {
                            console.log(sortCode)
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
                onSuccess={(data) => SubjectQuery.refetch()}
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