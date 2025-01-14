"use client";

import React, { useEffect, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { request } from '@/assets/helpers/request';
import API from '@/assets/configs/api';
import moment from "moment"
import { random } from 'lodash';
import { INFO_USER } from '@/assets/configs/request';
import { typeTeacherReSearch } from '@/assets/configs/general';
import TimeStringConvert from '@/assets/helpers/TimeStringConvert';


export default function Page({ params: { id } }: { params: { id: string } }) {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [listComment, setListComment] = useState<Icomment[]>([])
    const [info, setInfo] = useState<UserLoginType | null>(null)
    useEffect(() => {
        const jinfo = localStorage.getItem(INFO_USER)
        if (jinfo === null) {
            return
        }
        const info: UserLoginType = JSON.parse(jinfo)
        setInfo(info)
    }, [])

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };
    const FeedBackMutation = useMutation<any, AxiosError<ResponseType>, any>({

        mutationFn: (data) => {
            return request.post(API.feedBack.insert, data)
        },
    });
    const ListResearchListQuery = useQuery<ReSearchType, AxiosError<ResponseType>>({
        queryKey: ['Research', id],
        queryFn: async () => {
            const response: any = await request.get<ReSearchType>(`${API.reSearch.showone}${id}`);
            let responseData = response.data ?? [];
            setListComment(responseData?.result.feedbacks)
            console.log(responseData)
            return responseData?.result;
        },
    });
    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            const datareq = {
                message: newComment,
                researchID: id
            }
            FeedBackMutation.mutate(datareq, {
                onSuccess: (_: any) => {
                    setListComment([{
                        id: random.toString(),
                        message: newComment,
                        createdBy: info ? info.id : "",
                        createdDate: Date.now().toString(),
                        senderName: info ? info.teacher.name : "",
                        senderCode: info ? info.id : "",
                    }, ...listComment])
                    close();
                    // toast.success("comment thành công");
                },
            })
            // ListResearchListQuery.refetch()
            //ListResearchListQuery.data?.Comment.push(datareq);
            setNewComment("");
            setShowCommentInput(false);
        }
    };

    const tempComment = (item: Icomment) => (
        <div key={item.id} className="card" style={{ backgroundColor: 'white', padding: "16px", marginBottom: "16px" }}>
            <div style={{ minWidth: '50vw' }} className='overflow-hidden'>
                <div className='mt-2 formgrid grid'>
                    <div className='col-12 flex flex-column gap-3 mb-2'>
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 'bold', margin: '0' }}>{item.senderName}</p>
                                <span style={{ color: '#606060', margin: '0', fontSize: '0.575rem' }}>{TimeStringConvert.convertDateComparteNow(item.createdDate)}</span>
                                <p style={{ marginTop: '0.5rem' }}>
                                    {item.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    const tempReSearch = (data: ReSearchType) => {
        console.log(data)
        const gvhd = data?.researchTeachers?.find(tc => tc.typeTeacher.name === typeTeacherReSearch.gvhuongdan)?.teacher
        return <div className="card" style={{ backgroundColor: 'white', padding: "16px" }}>
            <div style={{ minWidth: '50vw' }} className='overflow-hidden'>
                <form className='mt-2 formgrid grid'>
                    <div className='col-6 flex flex-column gap-3 mb-2'>
                        <label htmlFor="nameThesis">Tên đề tài</label>
                        <InputText id="nameThesis" value={data?.name} readOnly />
                    </div>
                    <div className='col-6 flex flex-column gap-3 mb-2'>
                        <label htmlFor="idBomon">Chuyên ngành yêu cầu</label>
                        <InputText id="idBomon" value={data?.subject?.name} readOnly />
                    </div>
                    <div className='col-6 flex flex-column gap-3 mb-2'>
                        <label htmlFor="instructors">Giảng viên hướng dẫn</label>
                        <InputText id="instructors" value={gvhd?.name} readOnly />
                    </div>
                    <div className='col-2 flex flex-column gap-3 mb-2 mr-6'>
                        <label htmlFor="minTV">Số lượng tối thiểu</label>
                        <InputNumber id="minTV" value={data?.minMembers} readOnly />
                    </div>
                    <div className='col-2 flex flex-column gap-3 mb-2'>
                        <label htmlFor="maxTV">Số lượng tối đa</label>
                        <InputNumber id="maxTV" value={data?.maxMembers} readOnly />
                    </div>
                    <div className='col-9 flex flex-column gap-3 mb-2'>
                        <label htmlFor="students">Sinh viên tham gia đề tài</label>
                        <InputText id="students" value="" readOnly /> {/* Placeholder cho sinh viên */}
                    </div>
                    <div className='col-12 flex flex-column gap-3 mb-2'>
                        <label htmlFor="details">Chi tiết</label>
                        <div id="details" dangerouslySetInnerHTML={{ __html: data?.detail }} />
                    </div>
                </form>
            </div>
        </div>
    }
    return ListResearchListQuery.data && (

        <div className="container">
            {tempReSearch(ListResearchListQuery.data)}
            <div className="mt-4">
                <div className="flex" style={{ justifyContent: "space-between" }}>
                    <h3 className="card" style={{ padding: "16px" }}>Bình luận</h3>
                    <Button label="Bình luận" size="small" onClick={() => setShowCommentInput(!showCommentInput)} />
                </div>
                {showCommentInput && (
                    <div className="card" style={{ backgroundColor: 'white', padding: "16px", marginBottom: "16px" }}>
                        <div className="flex flex-column gap-3">
                            <InputText
                                value={newComment}
                                onChange={handleCommentChange}
                                placeholder="Nhập bình luận của bạn"
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <Button label="Hủy" severity="secondary" onClick={() => setShowCommentInput(false)} />
                                <Button label="Gửi" onClick={handleCommentSubmit} />
                            </div>
                        </div>
                    </div>
                )}
                {listComment.length > 0 && listComment.map(item => tempComment(item))}
            </div>
        </div>
    );
}
