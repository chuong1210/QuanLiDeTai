'use client'

import { FormRefType, TypeSelected } from "@/assets/types/form";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { Button } from "primereact/button"
import { useRef, useState } from "react";
import Confirm from "@/resources/components/UI/Confirm";
import { Tag } from "primereact/tag";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as request from "@/assets/helpers/request"
import API from "@/assets/configs/api";
import { MetaType, ParamType } from "@/assets/types/request";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import ROUTER from "@/assets/configs/routers";
import { Dialog } from "primereact/dialog";
export const key = "dề tài"
interface fieldsType {
    field: string;
    code: 'note' | "name" | "minMembers" | "maxMembers" | "stage" | "schoolYear" | "detail";
    typeInput: string
}
export const fields: fieldsType[] = [
    { field: "note", code: "note", typeInput: "text" },
    { field: "Tên đề tài", code: "name", typeInput: "text" },
    { field: "Thành viên tối thiểu", code: "minMembers", typeInput: "text" },
    { field: "Thành viên tối đa", code: "maxMembers", typeInput: "text" },
    { field: "Đợt", code: "stage", typeInput: "text" },
    { field: "Năm học", code: "schoolYear", typeInput: "text" },
    { field: "Chi tiết", code: "detail", typeInput: "text" }
]
export default function Page() {

    const formDetail = useRef<any>();
    const [currentJob, setCurrentJob] = useState<string>()
    const ListMyJobQuery = useQuery<JobAll[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['list-job'],
        queryFn: async () => {
            const response = await request.get<JobAll[]>(API.job.ShowMyJob);
            let responseData: any = response.data ?? [];
            return responseData.result;
        }
    });


    const itemTemplate = (thesis: JobAll, index: number) => {
        return (
            thesis?.id && <div className="col-12" key={index} style={{ padding: '8px 0' }}>
                <div className={`flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 border-round ${index !== 0 ? 'border-top-1 surface-border' : ''}`} style={{ backgroundColor: 'white', border: '1px solid #ccc', position: 'relative' }}>
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3 col-8">
                        <div
                            className="text-2xl font-bold text-800"
                            style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-word', fontSize: '1.2rem' }} // Giảm font-size cho tiêu đề
                        >
                            <Link href={`${ROUTER.job.tasks_assigned}/${thesis.id}`} style={{ cursor: "pointer", display: 'block', minWidth: '50vw' }}>
                                {thesis.name}
                            </Link >
                        </div>
                    </div>
                </div>
            </div >
        );
    };
    const listTemplate = (items: JobAll[]) => {
        if (!items || items.length === 0) return null;

        let list = items.map((thesis, index) => {
            return itemTemplate(thesis, index);
        });

        return <div className="grid grid-nogutter" style={{ width: '100%' }}>{list}</div>;
    };
    return (
        <div>


            {
                ListMyJobQuery.data && ListMyJobQuery.data.length > 0 ? <div><h2>Nhiệm vụ hiện tại của bạn : </h2>{listTemplate(ListMyJobQuery.data)}</div> : <h2>Tuyệt vời bạn không có công việc nào được giao</h2>
            }



        </div >
    )
}
