"use client";

import React, { useState } from 'react';
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { request } from '@/assets/helpers/request';
import API from '@/assets/configs/api';
import { toast } from 'react-toastify';

interface ItypeThesis {
    ID: string;
    NameThesis: string;
    CodeThesis: string;
    NameTeacher: string;
    MinTV: number;
    MaxTV: number;
    NhomChuyenNganh: string[];
    Status: string;
    Detail: string;
    Comment: Icomment[];
}

interface Icomment {
    ID: string;
    NameTeacher: string;
    CreateAt: string;
    Content: string;
}

const comments: Icomment[] = [
    {
        ID: "1",
        NameTeacher: "Nguyen Thi Mai",
        CreateAt: "2024-07-25T08:30:00Z",
        Content: "Hệ thống quản lý kho hàng cần cải thiện tính năng báo cáo để dễ dàng xuất báo cáo theo các tiêu chí tùy chỉnh hơn."
    },
    {
        ID: "2",
        NameTeacher: "Tran Van An",
        CreateAt: "2024-07-24T09:00:00Z",
        Content: "Giao diện người dùng có thể được tối ưu hóa để giảm thiểu số bước cần thiết để thực hiện các thao tác thường xuyên."
    },
    {
        ID: "3",
        NameTeacher: "Le Thi Hoa",
        CreateAt: "2024-07-23T10:15:00Z",
        Content: "Nên thêm tính năng thông báo khi mức tồn kho của sản phẩm giảm xuống dưới mức tối thiểu để có thể kịp thời đặt hàng bổ sung."
    },
    {
        ID: "4",
        NameTeacher: "Pham Van Tuan",
        CreateAt: "2024-07-22T11:45:00Z",
        Content: "Có thể cải thiện chức năng kiểm kê bằng cách tích hợp công nghệ quét mã vạch để giảm thiểu lỗi do nhập liệu thủ công."
    },
    {
        ID: "5",
        NameTeacher: "Nguyen Minh Duc",
        CreateAt: "2024-07-21T13:30:00Z",
        Content: "Nên xem xét việc thêm khả năng đồng bộ dữ liệu giữa nhiều kho để quản lý hàng tồn kho hiệu quả hơn trên toàn hệ thống."
    },
    {
        ID: "6",
        NameTeacher: "Hoang Thi Lan",
        CreateAt: "2024-07-20T14:00:00Z",
        Content: "Tính năng tìm kiếm và lọc thông tin có thể cần thêm các tùy chọn nâng cao để dễ dàng tìm kiếm các sản phẩm theo các tiêu chí cụ thể hơn."
    },
    {
        ID: "7",
        NameTeacher: "Vu Thi Mai",
        CreateAt: "2024-07-19T15:15:00Z",
        Content: "Hệ thống nên có các hướng dẫn chi tiết hơn cho người dùng mới để giúp họ làm quen nhanh chóng với các chức năng của hệ thống."
    },
    {
        ID: "8",
        NameTeacher: "Phan Thanh Son",
        CreateAt: "2024-07-18T16:00:00Z",
        Content: "Có thể cải thiện khả năng mở rộng của hệ thống bằng cách cho phép người dùng thêm các mô-đun tùy chỉnh theo nhu cầu kinh doanh của họ."
    },
    {
        ID: "9",
        NameTeacher: "Nguyen Thi Thu",
        CreateAt: "2024-07-17T17:30:00Z",
        Content: "Nên xem xét việc tích hợp với các hệ thống ERP hiện tại để quản lý hàng hóa một cách toàn diện hơn và giảm thiểu việc nhập liệu trùng lặp."
    },
    {
        ID: "10",
        NameTeacher: "Tran Thi Lan",
        CreateAt: "2024-07-16T18:00:00Z",
        Content: "Hệ thống có thể cần cải thiện khả năng báo cáo phân tích với các tùy chọn đồ thị và biểu đồ để giúp người dùng dễ dàng hiểu các xu hướng hàng tồn kho."
    }
];
const thesis: ItypeThesis = {
    ID: "1",
    NameThesis: "Hệ thống quản lý kho hàng",
    CodeThesis: "201-xrhet-12dv",
    NameTeacher: "Nguyen Thi Mai",
    MinTV: 2,
    MaxTV: 4,
    NhomChuyenNganh: ["quản lý", "dữ liệu"],
    Status: "subject",
    Detail: `<div style="font-size: 1rem;">
        <p style="margin-bottom: 1rem;"><strong>Tiêu đề:</strong> Hệ thống quản lý kho hàng</p>
        <p style="margin-bottom: 1rem;"><strong>Mã đề tài:</strong> 201-xrhet-12dv</p>
        <p style="margin-bottom: 1rem;"><strong>Giảng viên:</strong> Nguyen Thi Mai</p>
        <p style="margin-bottom: 1rem;"><strong>Số lượng TV:</strong> 2-4</p>
        <p style="margin-bottom: 1rem;"><strong>Nhóm chuyên ngành:</strong> quản lý, dữ liệu</p>
        <p style="margin-bottom: 1rem;"><strong>Trạng thái:</strong> subject</p>
        <p style="margin-bottom: 1rem;"><strong>Mô tả:</strong></p>
        <ul style="margin-top: 0; padding-left: 1.5rem;">
            <li style="margin-bottom: 0.5rem;">Thiết kế và phát triển hệ thống phần mềm quản lý kho hàng để theo dõi và quản lý hàng tồn kho.</li>
            <li style="margin-bottom: 0.5rem;">Đảm bảo hệ thống có các chức năng chính như quản lý nhập kho, xuất kho, kiểm kê và báo cáo hàng tồn kho.</li>
            <li style="margin-bottom: 0.5rem;">Xây dựng giao diện người dùng trực quan và dễ sử dụng, hỗ trợ các chức năng tìm kiếm và lọc thông tin kho hàng.</li>
            <li style="margin-bottom: 0.5rem;">Đảm bảo hệ thống có khả năng mở rộng và tích hợp với các hệ thống khác nếu cần.</li>
            <li style="margin-bottom: 0.5rem;">Thực hiện kiểm thử và đảm bảo chất lượng phần mềm trước khi triển khai.</li>
        </ul>
    </div>`,
    Comment: comments
};

export default function Page({ params: { id } }: { params: { id: string } }) {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [newComment, setNewComment] = useState("");

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };
    const FeedBackMutation = useMutation<any, AxiosError<ResponseType>, any>({

        mutationFn: (data) => {

            //console.log(data)
            return request.post(API.feedBack.insert, data)
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
                    close();
                    toast.success("Tạo thành công");
                },
            })
            //thesis.Comment.push(datareq);
            setNewComment("");
            setShowCommentInput(false);
        }
    };

    const tempComment = (item: Icomment) => (
        <div key={item.ID} className="card" style={{ backgroundColor: 'white', padding: "16px", marginBottom: "16px" }}>
            <div style={{ minWidth: '50vw' }} className='overflow-hidden'>
                <div className='mt-2 formgrid grid'>
                    <div className='col-12 flex flex-column gap-3 mb-2'>
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 'bold', margin: '0' }}>{item.NameTeacher}</p>
                                <p style={{ color: '#606060', margin: '0', fontSize: '0.875rem' }}>{item.CreateAt}</p>
                                <p style={{ marginTop: '0.5rem' }}>
                                    {item.Content}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container">
            <div className="card" style={{ backgroundColor: 'white', padding: "16px" }}>
                <div style={{ minWidth: '50vw' }} className='overflow-hidden'>
                    <form className='mt-2 formgrid grid'>
                        <div className='col-6 flex flex-column gap-3 mb-2'>
                            <label htmlFor="nameThesis">Tên đề tài</label>
                            <InputText id="nameThesis" value={thesis.NameThesis} readOnly />
                        </div>
                        <div className='col-6 flex flex-column gap-3 mb-2'>
                            <label htmlFor="idBomon">Chuyên ngành yêu cầu</label>
                            <InputText id="idBomon" value={thesis.NhomChuyenNganh.join(", ")} readOnly />
                        </div>
                        <div className='col-6 flex flex-column gap-3 mb-2'>
                            <label htmlFor="instructors">Giảng viên hướng dẫn</label>
                            <InputText id="instructors" value={thesis.NameTeacher} readOnly />
                        </div>
                        <div className='col-2 flex flex-column gap-3 mb-2 mr-6'>
                            <label htmlFor="minTV">Số lượng tối thiểu</label>
                            <InputNumber id="minTV" value={thesis.MinTV} readOnly />
                        </div>
                        <div className='col-2 flex flex-column gap-3 mb-2'>
                            <label htmlFor="maxTV">Số lượng tối đa</label>
                            <InputNumber id="maxTV" value={thesis.MaxTV} readOnly />
                        </div>
                        <div className='col-9 flex flex-column gap-3 mb-2'>
                            <label htmlFor="students">Sinh viên tham gia đề tài</label>
                            <InputText id="students" value="" readOnly /> {/* Placeholder cho sinh viên */}
                        </div>
                        <div className='col-12 flex flex-column gap-3 mb-2'>
                            <label htmlFor="details">Chi tiết</label>
                            <div id="details" dangerouslySetInnerHTML={{ __html: thesis.Detail }} />
                        </div>
                    </form>
                </div>
            </div>
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
                {thesis.Comment.map(item => tempComment(item))}
            </div>
        </div>
    );
}
