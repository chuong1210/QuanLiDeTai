"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { request } from '@/assets/helpers/request';
import API from '@/assets/configs/api';
import { TabPanel, TabView } from 'primereact/tabview';
import BangTinTemp from './bangtintemp';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
interface fieldsType {
    field: string;
    code: 'code' | "name" | "myClass" | "phoneNumber" | "email";
    typeInput: string;
    numberID?: string
}
export const fields: fieldsType[] = [
    { field: "MSSV", code: "code", typeInput: "text" },
    { field: "Tên", code: "name", typeInput: "text" },
    { field: "Lớp", code: "myClass", typeInput: "text" },
    { field: "Số điện thoại", code: "phoneNumber", typeInput: "text" },
    { field: "Email", code: "email", typeInput: "text" },
    // { field: "Điểm hướng dẫn", code: "POINT_THESIS_ADVISOR.point", typeInput: "number", numberID: "2" },
    // { field: "Điểm trung bình", code: "POINT_AVG", typeInput: "text", numberID: "0" },
]
export default function Page({ params: { id } }: { params: { id: string } }) {


    const ResearchDetailQuery = useQuery<ReSearchType, AxiosError<ResponseType>>({
        queryKey: ['Research', id],
        queryFn: async () => {
            const response: any = await request.get<ReSearchType>(`${API.reSearch.showone}${id}`);
            let responseData = response.data ?? [];
            return responseData?.result;
        },
    });
    const onSuccess = () => {
        console.log("có chạy tới đích")
        ResearchDetailQuery.refetch()
    }
    // viết hàm sao
    return <TabView>
        <TabPanel header="Bản tin" style={{ justifyContent: "center", display: 'flex' }}>
            <BangTinTemp reSearch={ResearchDetailQuery?.data} onSuccess={onSuccess} />
        </TabPanel>
        <TabPanel header="Thành viên">
            <DataTable
                value={ResearchDetailQuery?.data?.group?.students}
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

                    header={"Trưởng nhóm"}
                    body={(vl: StudentType) => { return vl?.id === ResearchDetailQuery?.data?.group?.leaderId ? < i className="pi pi-check-circle flex" style={{ color: 'green', justifyContent: "center" }}></i> : null }}
                />
                {fields.map((field, index) => < Column
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

        </TabPanel>
    </TabView>
}
