"use client"

import API from '@/assets/configs/api';
import * as request from '@/assets/helpers/request';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import Link from 'next/link';
import ROUTER from '@/assets/configs/routers';
import Form from './form';
import { useRef, useState } from 'react';
import { FormRefType, TypeSelected } from '@/assets/types/form';
import { OverlayPanel } from 'primereact/overlaypanel';
import { MenuItem } from '@/resources/components/UI';
import { MenuItemType } from '@/assets/types/menu';
import header_menu from '@/assets/configs/header_menu';
import { Card } from 'primereact/card';
import moment from 'moment';
import { getJobFrom } from '@/assets/configs/job';
import { cookies } from '@/assets/helpers';
import { roleE } from '@/assets/configs/general';
import { ROLE_USER } from '@/assets/configs/request';
const key = "nhiệm vụ";



const Page = () => {
    const [setlected, setSelected] = useState<TypeSelected<JobAll>>()
    const formRef = useRef<FormRefType<JobAll>>(null);

    const actionsModalRef = useRef<OverlayPanel>(null);



    const handleClickAction = (item: MenuItemType, job: JobAll) => {
        if (item.code === "update") {
            formRef.current?.show?.(job, "edit");
            setSelected({ type: "edit", data: job })
        }
    }



    const MyJobDeliveredQuery = useQuery<JobAll[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ["my-job-delivered"],
        queryFn: async () => {
            const response = await request.get<JobAll[]>(API.job.ShowMyJobDelivered);
            let responseData: any = response.data ?? [];
            return responseData?.result;
        }
    });


    const itemTemplate = (thesis: JobAll, index: number) => {
        return (
            thesis?.id &&
            <Card
                key={index}
                // subTitle={`Hết hạn: ${new Date(Date.now()).toLocaleString("vi-VN")}`}
                className="mb-2"
                style={{ marginRight: "auto", width: "60%" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <div className="flex" style={{ alignItems: 'center' }}>
                        <i className="pi pi-book p-2 mx-2" style={{ color: "green", fontSize: "20px", borderRadius: "9999px", border: "2px solid green" }}></i>
                        <div>

                            <Link href={`${ROUTER.job.tasks_assigned}/${thesis.id}`} style={{ cursor: "pointer", display: 'block' }}>
                                {thesis.name}
                            </Link >
                            <p>{moment(thesis.from, 'YYYY-MM-DD HH:mm:ss.SSSSSS').format('D [thg] M, YYYY')}
                            </p>
                        </div>
                    </div>
                    <i className="pi pi-ellipsis-v" onClick={(e) => actionsModalRef?.current?.toggle(e)}></i>
                </div>
                <OverlayPanel ref={actionsModalRef} className='p-0' style={{ minWidth: "200px" }}>
                    <ul>
                        {header_menu.TASKS_ASSIGNED().map(item => <MenuItem key={item.code} item={{ ...item, onItemClick: (_item) => handleClickAction(_item, thesis) }} />)}
                    </ul>
                </OverlayPanel>
            </Card>

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
            <div><h2>Nhiệm vụ bạn đã giao : </h2>
                <Button
                    label={`Thêm nhiệm vụ mới`}
                    icon='pi pi-plus'
                    size='small'
                    className="my-3"
                    onClick={() => {
                        formRef.current?.show?.(
                            { name: getJobFrom(cookies.get<roleE[]>(ROLE_USER) || [roleE.giaovien])?.name },
                            "create"
                        );
                        setSelected({ type: "create", data: undefined })
                    }}
                />
                {MyJobDeliveredQuery.data && listTemplate(MyJobDeliveredQuery?.data)}</div>
            {/* <Form
                type={setlected?.type || "detail"}
                onSuccess={() => {
                    MyJobDeliveredQuery.refetch()
                }}
                // data={setlected?.data}
                title={`${setlected?.type === "detail" ?
                    `Thông tin ${key} ${setlected?.data?.name || ""}`
                    : setlected?.type === "create" ?
                        `Thêm ${key} mới` :
                        `Chỉnh sửa thông tin ${key} ${setlected?.data?.name || ""}`}`}
                ref={formRef} /> */}
            <Form
                type={setlected?.type || "detail"}
                onSuccess={() => {
                    // console.log("có chạy trang bảng tin")
                    MyJobDeliveredQuery.refetch()
                }}
                data={setlected?.data}
                title={`${setlected?.type === "detail" ?
                    `Thông tin ${key} ${setlected?.data?.name || ""}`
                    : setlected?.type === "create" ?
                        `Thêm ${key} mới` :
                        `Chỉnh sửa thông tin ${key} ${setlected?.data?.name || ""}`}`}
                ref={formRef} />
        </div>
    )
}
// Page.displayName = `forwardRefInSert`
export default Page
