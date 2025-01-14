"use client"

import React, { useState, useRef } from 'react';
import { Tag } from 'primereact/tag';
import Link from 'next/link';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import API from '@/assets/configs/api';
import * as request from "@/assets/helpers/request"
import { MetaType, ParamType } from '@/assets/types/request';
import { statusRsE, typePoinsE, typeTeacherReSearch } from '@/assets/configs/general';

export default function PageNhomDetai({ type, title }: { type: string, title: string }) {
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);

    const paramsRef = useRef<ParamType>({
        page: meta.currentPage,
        limit: meta.limit,
        orderBy: 'id',
        orderDirection: 'ASC',
    });

    const ListResearchListQuery = useQuery<ReSearchType[], AxiosError<ResponseType>>({
        queryKey: ['list-Research', type],
        queryFn: async () => {

            let typeTeacher = typePoinsE.gvhuongdan === type ? "roleInstructor"
                : typePoinsE.gvphanbien === type ? "roleThesisAdvisor" : "roleCouncil"
            console.log(typeTeacher)
            const response: any = await request.get<ReSearchType[]>(`${API.reSearch.showall_my_research}`, {
                params: {
                    ...paramsRef.current,
                    roleCouncil: type === typePoinsE.hoidong ? true : false,
                    roleInstructor: type === typePoinsE.gvhuongdan ? true : false,
                    roleThesisAdvisor: type === typePoinsE.gvphanbien ? true : false,
                    status: "AS"
                }
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
            if (responseData?.result?.responses) {
                responseData.result.responses = responseData.result.responses.map((tc: ReSearchType) => {
                    // check student have point
                    const allStudentsHavePoint = tc?.group?.students.every(student =>
                        student?.points?.some(point => point.typePoint?.id === type)
                    );
                    // check differencePoint
                    let diffPoints = false
                    tc?.group?.students.forEach(student => {
                        const [point1, point2] = [typePoinsE.gvhuongdan, typePoinsE.gvphanbien].map(
                            type => student.points?.find(point => point.typePoint?.id === type)?.point
                        );

                        if (point1 !== undefined && point2 !== undefined && Math.abs(point1 - point2) > 1) {
                            diffPoints = true;
                            //console.log(`Sinh viên ${student.name} có điểm ${typePoinsE.gvhuongdan} và ${typePoinsE.gvphanbien} cách nhau quá 1 điểm: ${point1} - ${point2}`);
                        }
                    });
                    return {
                        ...tc,
                        exitAdvisor: !!tc?.researchTeachers?.find((chhecl: any) => chhecl.typeTeacher.name === typeTeacherReSearch.gvphanbien),
                        exitCoucli: !!tc?.researchTeachers?.find((chhecl: any) => chhecl.typeTeacher.name === typeTeacherReSearch.hoidong),
                        donePoint: allStudentsHavePoint ? true : false,
                        differencePoint: diffPoints
                    }
                })
            }
            // responseData.result.responses.exitAdvisor = !!responseData?.result?.responses?.researchTeachers.find((chhecl: any) => chhecl.typeTeacher === typeTeacherReSearch.gvphanbien)
            // responseData.result.responses.exitCoucli = !!responseData?.result?.responses?.researchTeachers.find((chhecl: any) => chhecl.typeTeacher === typeTeacherReSearch.hoidong)
            console.log(responseData?.result.responses)
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


    const itemTemplate = (thesis: ReSearchType, index: number) => {
        console.log(thesis, index)
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
                            <span className="font-semibold">Nhóm chuyên ngành:</span> {thesis.subject?.name}
                        </div>
                    </div>
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-2 gap-3 col-4" style={{ minHeight: "120px" }}>
                        <div className="flex gap-2 sm:gap-1" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                            {!thesis.exitAdvisor && type === typePoinsE.gvhuongdan && <Tag severity="warning">Thêm giảng viên phản biện</Tag>}
                            {!thesis.donePoint && <Tag severity="warning">Chưa nhập điểm</Tag>}
                            {thesis.differencePoint && !thesis.exitCoucli && <Tag severity="warning">Điểm sinh viên không phù hợp</Tag>}
                        </div>
                        {/* {!thesis.donePoint && <div className="flex gap-2 sm:gap-1" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                        </div>} */}
                        <div className="flex gap-2 sm:gap-1" style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                            <Link style={{ textDecoration: "underline", fontSize: '1rem' }} href={`/graduation_thesis/point/${thesis.id}/${type}`}>Đánh giá đề tài</Link> {/* Giảm font-size cho liên kết */}
                        </div>
                    </div>
                </div>
            </div >
        );
    };


    const listTemplate = (items: ReSearchType[]) => {
        if (!items || items.length === 0) return null;
        let list
        if (items && items.length > 0) {
            list = items?.map((thesis, index) => {
                return itemTemplate(thesis, index);
            });
        }
        return <div className="grid grid-nogutter" style={{ width: '100%' }}>{list}</div>;
    };
    return (

        <div className="card">
            <h6>{title}</h6>
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

        </div>

    )
}
