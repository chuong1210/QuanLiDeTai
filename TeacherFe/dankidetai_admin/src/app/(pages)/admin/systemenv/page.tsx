"use client"
import { Dropdown } from "@/resources/components/form";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
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
import { ROLE_USER } from "@/assets/configs/request";
import { cookies } from "@/assets/helpers";
import { MetaType, ParamType } from "@/assets/types/request";


interface fieldsType {
    field: string;
    code: 'description' | "name" | "value";
    typeInput: string
}
export const fields: fieldsType[] = [
    // { field: "id", code: "id", typeInput: "text" },
    { field: "Biến", code: "name", typeInput: "text" },
    { field: "Giá trị", code: "value", typeInput: "text" },
    { field: "Chi tiết", code: "description", typeInput: "text" }
]
export const key = "biến hệ thống"
function Page() {
    //const fieldss = ["id", "name", "departments.name"]
    const [setlected, setSelected] = useState<TypeSelected<SystemType>>()
    const formRef = useRef<FormRefType<SystemType>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);

    const SystemENVQuery = useQuery<SystemType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response: any = await request.get<SystemType[]>(`${API.systemenv.getAll}`);
            let responseData = response.data?.result ?? [];
            console.log(responseData)
            return responseData || [];
        },
    });

    const SubjectMutation = useMutation<any, AxiosError<ResponseType>, SystemType>({
        mutationFn: (data) => {
            return request.remove(`${API.councils.delete}`, { data: [data?.id] });
        },
    });


    const renderActions = (data: SystemType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                <FaInfoCircle className="hover:text-primary cursor-pointer" onClick={() => {
                    formRef.current?.show?.(data);
                    setSelected({ type: "detail", data: data })
                }} />
                {/* {roles.includes(roleE.admin) && */}
                {cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.truongkhoa) &&
                    (
                        <>
                            <i
                                className='pi pi-pencil hover:text-primary cursor-pointer'
                                onClick={() => {
                                    formRef.current?.show?.(data);
                                    setSelected({ type: "edit", data: data })
                                }}
                            />

                        </>
                    )}
            </div>
        );
    };

    const onRemove = (data: SystemType) => {
        SubjectMutation.mutate(data, {
            onSuccess: () => {
                SystemENVQuery.refetch();
                toast.success("Xóa thành công");
            },
        });
    }

    return (
        <div>
            {SystemENVQuery.isFetching || SubjectMutation.isPending && <Loader />}
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />
            <div >

                <DataTable
                    value={SystemENVQuery.data}
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
                        body={(SystemENVQuery.isLoading || SubjectMutation.isPending) && <Skeleton />}
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


                </div>
            </div>
            <Form
                type={setlected?.type || "detail"}
                data={setlected?.data}
                onSuccess={(data) => SystemENVQuery.refetch()}
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