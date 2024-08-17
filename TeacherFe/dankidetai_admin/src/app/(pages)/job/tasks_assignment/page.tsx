"use client"
import React, { useRef } from 'react'
import FormInsert from "./formInsert"
import { Button } from 'primereact/button';
import { Dropdown } from '@/resources/components/form';
import { OptionType } from '@/assets/types/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { request } from '@/assets/helpers/request';
import API from '@/assets/configs/api';
import { jwtDecode } from 'jwt-decode';
import { cookies } from '@/assets/helpers';
import { ACCESS_TOKEN } from '@/assets/configs/request';

const dataJob = [{ label: "Yêu cầu giảng viên ra đề tài", value: "Yêu cầu giảng viên ra đề tài" },
{ label: "Yêu cầu giảng viên góp ý đề tài", value: "Yêu cầu giảng viên góp ý đề tài" },
{
    label: "Nhiệm vụ tuần cho sinh viên", value: "Nhiệm vụ tuần cho sinh viên"
}
]
export default function Page() {

    const formInsert = useRef<any>();
    // const JobOfTeacher = useQuery<TeacherType[], AxiosError<ResponseType>>({
    //     refetchOnWindowFocus: false,
    //     queryKey: ['list-job-of-teacher'],
    //     queryFn: async () => {
    //         const accout = jwtDecode(cookies.get(ACCESS_TOKEN) || "").sub
    //         const response: any = await request.get<TeacherType[]>(API.job.ShowAllJobOfTeacher, { params: { maSo: accout } });
    //         console.log(response)
    //         return response.data.result || [];
    //     },
    // });
    return (
        <div className='p-4 bg-white'>
            <h1>tùy chỉnh ở phía backend khi gửi về các loại nhiệm vụ gì có thể giao ở giai  đoạn hiện tại chức quyền hiện tại
                tùy theo loại nhiệm vụ ta phải flex ra các loại form để gửi về . ngoài ra thì phần này song
            </h1>
            <h2>Thêm luôn danh sách nhiemj vụ ở dưới cho để trống xóa trang nhiệm vụ được giao.</h2>
            <Dropdown
                id='form_data_industry_id'
                options={dataJob}
                //value={field.value}
                label={"Giao nhiện vụ"}
                placeholder={"Giao nhiện vụ."}
                onChange={(e) => {
                    formInsert.current.show(e);
                }} />
            <FormInsert
                type="detail"
                title={"Giao nhiệm vụ"}
                onSuccess={() => { }}
                ref={formInsert}
            />
        </div>
    )
}
