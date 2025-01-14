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
    code: 'teacherCode' | "subject.name" | "teacherName";
    typeInput: string
}
export const fields: fieldsType[] = [
    // { field: "id", code: "id", typeInput: "text" },
    { field: "Tên", code: "subject.name", typeInput: "text" },
    { field: "Họ tên", code: "teacherName", typeInput: "text" },
]
export const key = "hội đồng"
function Page() {
    //const fieldss = ["id", "name", "departments.name"]
    const [setlected, setSelected] = useState<TypeSelected<CouncilType>>()
    const formRef = useRef<FormRefType<CouncilType>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const paramsRef = useRef<ParamType>({
        page: meta.currentPage,
        limit: meta.limit,
        orderBy: 'id',
        orderDirection: 'ASC',
    });

    const CouncilQuery = useQuery<CouncilGetAllType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: [key, 'list'],
        queryFn: async () => {
            const response = await request.get<CouncilGetAllType[]>(`${API.councils.getAll}`, {
                params: paramsRef.current
            });
            let responseData = response.data?.result.responses ?? [];
            if (response.data?.result.currentPage && response.data?.result.totalPages) {
                setMeta({
                    currentPage: response.data?.result.currentPage,
                    hasNextPage: response.data?.result.currentPage + 1 === response.data?.result.totalPages ? false : true,
                    hasPreviousPage: response.data?.result.currentPage - 1 === 0 ? false : true,
                    limit: paramsRef.current.limit,
                    totalPages: response.data?.result.totalPages,
                });
            }
            responseData = responseData?.map((item: any) => {
                return {
                    ...item,
                    teacherName: item.teachers.map((tc: TeacherType) => tc.name).join(", "),
                }
            })
            return responseData || [];
        },
    });

    const SubjectMutation = useMutation<any, AxiosError<ResponseType>, CouncilType>({
        mutationFn: (data) => {
            return request.remove(`${API.councils.delete}`, { data: [data?.id] });
        },
    });


    const renderActions = (data: any) => {
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
                                    formRef.current?.show?.({
                                        teacherIds: data?.teachers.map((teacher: any) => teacher.id),
                                        subjectId: data?.subject?.id,
                                        teacherName: [],
                                        subjectName: "",
                                        id: data?.id,
                                    });
                                    setSelected({ type: "edit", data: data })
                                }}
                            />

                        </>
                    )}
            </div>
        );
    };

    const onRemove = (data: CouncilType) => {
        SubjectMutation.mutate(data, {
            onSuccess: () => {
                CouncilQuery.refetch();
                toast.success("Xóa thành công");
            },
        });
    }
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        if (paramsRef.current.limit === event.rows && paramsRef.current.page - 1 === event.page) return
        paramsRef.current = { page: Math.ceil((event.first) / event.rows) + 1, limit: event.rows, orderBy: "id", orderDirection: "ASC", }
        setMeta(e => ({ ...e, limit: event.rows }))
        CouncilQuery.refetch();
    };
    return (
        <div>
            {CouncilQuery.isFetching || SubjectMutation.isPending && <Loader />}
            <Confirm
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />

            {cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.truongkhoa) &&
                <>
                    <h3 className=""> Quản lý {key}</h3>
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

                </>
            }
            <div >

                <DataTable
                    value={CouncilQuery.data}
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
                        body={(CouncilQuery.isLoading || SubjectMutation.isPending) && <Skeleton />}
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
                        first={meta.currentPage * meta.limit - 1}
                        rows={meta.limit}
                        //pageLinkSize={meta.limit}
                        totalRecords={meta.limit * meta.totalPages}
                        rowsPerPageOptions={request.ROW_PER_PAGE}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
            <Form
                type={setlected?.type || "detail"}
                data={setlected?.data}
                onSuccess={(data) => CouncilQuery.refetch()}
                title={`${setlected?.type === "detail" ?
                    `Thông tin ${key} ${setlected?.data?.subjectName || ""}`
                    : setlected?.type === "create" ?
                        `Thêm ${key} mới` :
                        `Chỉnh sửa thông tin ${key} ${setlected?.data?.subjectName || ""}`}`}
                ref={formRef} />

        </div>
    )
}

export default Page