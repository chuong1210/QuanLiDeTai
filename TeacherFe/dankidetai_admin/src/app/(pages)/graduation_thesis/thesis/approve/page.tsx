"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import Link from 'next/link';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import API from '@/assets/configs/api';
import * as request from "@/assets/helpers/request"
import { useSearchParams } from 'next/navigation';
import { MetaType, ParamType } from '@/assets/types/request';
import { roleE, statusRsE, typeTeacherReSearch } from '@/assets/configs/general';
import { cookies } from '@/assets/helpers';
import { ROLE_USER } from '@/assets/configs/request';
import { toast } from 'react-toastify';
import Confirm from '@/resources/components/UI/Confirm';
import { ConfirmModalRefType } from '@/assets/types/modal';
import ConfirmWithFeedback from '@/resources/components/UI/ConfirmWithFeedback';
import { MenuItemType } from '@/assets/types/menu';
import { ContextMenu } from 'primereact/contextmenu';
export const key = "đề tài";



interface ContextMenuRef {
    show: (e: MouseEvent) => void;
}
export default function Page() {



    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const paramsRef = useRef<ParamType>({
        page: meta.currentPage,
        limit: meta.limit,
        orderBy: 'id',
        orderDirection: 'ASC',
    });
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const confirmFeedbackModalRef = useRef<ConfirmModalRefType>(null);

    const ListResearchListQuery = useQuery<ReSearchType[], AxiosError<ResponseType>>({

        queryKey: ['list-Research'],
        queryFn: async () => {

            const response: any = await request.get<ReSearchType[]>(`${API.reSearch.showall_to_approve}`, {
                params: paramsRef.current
            });
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
    // const [selectedId, setSelectedId] = useState<ReSearchType | null>();
    // const cm = useRef<ContextMenu>(null);
    // const onRightClick = (event: React.MouseEvent, research: ReSearchType): void => {
    //     if (cm.current) {
    //         // setSelectedId(id);
    //         if (research?.status === "PA") {
    //             cm.current.show(event);
    //         }
    //     }
    // };
    // const items: any[] = [
    //     {

    //         code: "approve",
    //         label: 'Duyệt',
    //         icon: 'pi pi-star',
    //         shortcut: '⌘+D',
    //         command: () => {
    //             // duyeet de  tai
    //             if (selectedId) {
    //                 handleDuyetDeTai(selectedId)
    //             }
    //             // confirmModalRef.current?.show?.(e, selectedId, `Bạn có chắc muốn duyệt ${key} ${selectedId?.name}`);

    //         }
    //     },
    //     {
    //         code: "suppport",
    //         label: 'Góp ý',
    //         icon: 'pi pi-shopping-cart',
    //         shortcut: '⌘+A',
    //         command: (e: any) => {

    //             confirmFeedbackModalRef.current?.show?.(e, selectedId, `Mời bạn góp ý ${key} ${selectedId?.name}`);
    //             // gop y de  tai
    //         }
    //     }
    // ]

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
            <div className="col-12" key={index} style={{ padding: '8px 0' }} >
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
                        <div className="flex align-items-center gap-3" style={{ fontSize: '1rem' }}>
                            <span className="flex align-items-center gap-2">
                                <span className="font-semibold">Mã đề tài: {thesis.code}</span>
                            </span>
                            <Tag value={thesis.status} severity={thesis.status === statusRsE.DE || thesis.status === statusRsE.PA ? 'danger' : 'success'}></Tag>
                        </div>
                        <div className="flex align-items-center gap-3" style={{ fontSize: '1rem' }}>
                            <span className="font-semibold">Nhóm chuyên ngành:</span> {thesis?.subject?.name}
                        </div>
                        {/* <div className="flex align-items-center gap-3" style={{ fontSize: '1rem' }}> 
                            <span className="font-semibold">Giảng viên hướng dẫn:</span> {thesis?.researchTeachers?.find(tc => tc.typeTeacher.name === typeTeacherReSearch.gvhuongdan)?.teacher?.name}
                        </div> */}
                    </div>
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-2 gap-3 col-4" style={{ minHeight: "120px" }}>
                        <div className="flex gap-2 sm:gap-1" style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                            {
                                thesis?.status === statusRsE.PA &&
                                // <Button outlined onClick={() => handleDuyetDeTai(thesis)}>Duyệt đề tài</Button>
                                <div className='flex'>
                                    <Button
                                        className='mx-1'
                                        style={{ minWidth: "70px" }}
                                        outlined onClick={(e) => {
                                            confirmFeedbackModalRef.current?.show?.(e, thesis, `Mời bạn góp ý ${key} ${thesis.name}`);
                                        }}>Góp ý </Button>
                                    <Button
                                        className='mx-1'
                                        style={{ minWidth: "70px" }}
                                        outlined onClick={(e) => {
                                            confirmModalRef.current?.show?.(e, thesis, `Bạn có chắc muốn duyệt ${key} ${thesis.name}`);
                                        }}>Duyệt</Button>
                                </div>
                            }
                            <Link style={{ marginTop: "24px", marginLeft: "8px", textDecoration: "underline", fontSize: '1rem' }} href={`/graduation_thesis/thesis/${thesis.id}`}>Chi tiết</Link> {/* Giảm font-size cho liên kết */}
                        </div>
                    </div>
                </div>
            </div >
        );
    };


    const listTemplate = (items: ReSearchType[]) => {
        if (!items || items.length === 0) return null;

        let list = items.map((thesis, index) => {
            return itemTemplate(thesis, index);
        });

        return <div className="grid grid-nogutter" style={{ width: '100%' }}>{list}</div>;
    };
    const handleFeedbackDeTai = (data: { feedback: string, data: ReSearchType }) => {
        /// chỗ này sẽ làm gì đó hay ho
        console.log(data)
    }
    return (

        <div className="card">
            {ListResearchListQuery.data &&
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
            <Confirm
                ref={confirmModalRef}
                onAccept={handleDuyetDeTai}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
                type="comfirm"
            />
            <Confirm
                ref={confirmFeedbackModalRef}
                onAccept={handleFeedbackDeTai}
                acceptLabel={'confirm'}
                rejectLabel={'cancel'}
            />
            {/* <ContextMenu model={items} ref={cm} breakpoint="767px" onHide={() => { setSelectedId(undefined) }} /> */}

        </div>

    )
}
