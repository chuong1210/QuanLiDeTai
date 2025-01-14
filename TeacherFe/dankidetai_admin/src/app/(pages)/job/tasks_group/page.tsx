"use client"

import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import Link from 'next/link';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import API from '@/assets/configs/api';
import * as request from "@/assets/helpers/request"
import { MetaType, ParamType } from '@/assets/types/request';
import { roleE, statusRsE } from '@/assets/configs/general';
import { cookies } from '@/assets/helpers';
import { ROLE_USER } from '@/assets/configs/request';
import { toast } from 'react-toastify';

export default function Page() {
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const paramsRef = useRef<ParamType>({
        page: meta.currentPage,
        limit: meta.limit,
        orderBy: 'id',
        orderDirection: 'ASC',
    });

    const ListResearchListQuery = useQuery<ReSearchType[], AxiosError<ResponseType>>({

        queryKey: ['list-my-Research-AS'],
        queryFn: async () => {
            const response: any = await request.get<ReSearchType[]>(`${API.reSearch.showall_my_research}`, {
                params: {
                    ...paramsRef.current,
                    roleCouncil: true,
                    status: "AS"
                }
            });
            // const response: any = await request.get<ReSearchType[]>(`${API.reSearch.showAll}`, {
            //     params: {
            //         ...paramsRef.current,
            //         search: "status:AS"
            //     }
            // });
            let responseData = response.data ?? [];

            if (response.data?.result.page && response.data?.result.totalPages) {
                setMeta({
                    currentPage: response.data?.result.page,
                    hasNextPage: response.data?.result.page + 1 === response.data?.result.totalPages ? false : true,
                    hasPreviousPage: response.data?.result.page - 1 === 0 ? false : true,
                    limit: paramsRef.current.limit,
                    totalPages: response.data?.result.totalPages,
                });

            }
            return responseData?.result.responses || [];
        },
    });


    const onPageChange = (event: PaginatorPageChangeEvent) => {
        if (paramsRef.current.limit === event.rows && paramsRef.current.page - 1 === event.page) return
        paramsRef.current = { page: Math.ceil((event.first) / event.rows) + 1, limit: event.rows, orderBy: "id", orderDirection: "ASC", }
        setMeta(e => ({ ...e, limit: event.rows }))
        ListResearchListQuery.refetch();
    }
    const MarkApprovedMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data: string) => {
            return request.update(API.reSearch.mark_approved + `/${data}`, undefined)
        },
    });
    const handleDuyetDeTai = (data: ReSearchType) => {
        MarkApprovedMutation.mutate(data?.id, {
            onSuccess: (_: any) => {
                toast.success("Đã duyệt đề tài:" + data?.name);
                ListResearchListQuery.refetch()
            },
        })
    }

    const itemTemplate = (thesis: ReSearchType, index: number) => {
        return (
            <div className="col-12" key={index} style={{ padding: '8px 0' }}>
                <div className={`flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 border-round ${index !== 0 ? 'border-top-1 surface-border' : ''}`} style={{ backgroundColor: 'white', border: '1px solid #ccc', position: 'relative' }}>
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3 col-8">
                        <div
                            className="text-2xl font-bold text-800"
                            style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-word', fontSize: '1.5rem' }} // Giảm font-size cho tiêu đề
                        >
                            <span style={{ display: 'block', minWidth: '50vw' }}>
                                {thesis.name}
                            </span>
                        </div>
                        <div className="flex align-items-center gap-3" style={{ fontSize: '1rem' }}> {/* Giảm font-size cho các thông tin khác */}
                            <span className="flex align-items-center gap-2">
                                <span className="font-semibold">Mã đề tài: {thesis.code}</span>
                            </span>
                            <Tag value={thesis.status} severity={thesis.status === statusRsE.DE || thesis.status === statusRsE.PA ? 'danger' : 'success'}></Tag>
                        </div>
                        <div className="flex align-items-center gap-3" style={{ fontSize: '1rem' }}> {/* Giảm font-size cho các thông tin khác */}
                            <span className="font-semibold">Nhóm chuyên ngành:</span> {thesis?.subject?.name}
                        </div>
                        {(thesis.status === statusRsE.PA) && (cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.truongkhoa) || cookies.get<roleE[]>(ROLE_USER)?.includes(roleE.truongbomon)) && (
                            <div > {/* Giảm font-size cho các thông tin khác */}
                                <Button onClick={() => handleDuyetDeTai(thesis)}>Duyệt đề tài</Button>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-2 gap-3 col-4" style={{ minHeight: "120px" }}>
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3" style={{ fontSize: '1rem' }}> {/* Giảm font-size cho các thông tin giảng viên và nhóm chuyên ngành */}
                            <div className="flex align-items-center gap-3">
                                {/* <span className="font-semibold">Giảng viên:</span> {thesis.teachers.map(item => item.name + ",")} */}
                            </div>
                            <div className="flex align-items-center gap-3">
                                {/* <span className="font-semibold">Số lượng TV:</span> {thesis.minMembers}-{thesis.maxMembers} */}
                            </div>
                            <div className="flex align-items-center gap-3">
                                {/* <span className="font-semibold">Nhóm chuyên ngành:</span> {thesis.subjects.map(item => item.name + ",")} */}
                            </div>

                        </div>

                        <div className="flex gap-2 sm:gap-1" style={{ position: 'absolute', bottom: '16px', right: '16px' }}>

                            <Link style={{ textDecoration: "underline", fontSize: '1rem' }} href={`/job/tasks_group/${thesis.id}`}>Xem tiến độ</Link> {/* Giảm font-size cho liên kết */}
                        </div>
                    </div>
                </div>
            </div >
        );
    };


    const listTemplate = (items: ReSearchType[]) => {
        if (!items || items.length === 0) return null;
        let list = items?.map((thesis, index) => {
            return itemTemplate(thesis, index);
        });

        return <div className="grid grid-nogutter" style={{ width: '100%' }}>{list}</div>;
    };
    return (

        <div className="card">
            {ListResearchListQuery.data && ListResearchListQuery.data?.length > 0 &&
                <div>
                    {listTemplate(ListResearchListQuery.data)}
                    <Paginator
                        first={meta.currentPage * meta.limit - 1}
                        rows={meta.limit}
                        //pageLinkSize={meta.limit}
                        totalRecords={meta.limit * meta.totalPages}
                        rowsPerPageOptions={request.ROW_PER_PAGE}
                        onPageChange={onPageChange} />
                </div>
            }

        </div>

    )
}
