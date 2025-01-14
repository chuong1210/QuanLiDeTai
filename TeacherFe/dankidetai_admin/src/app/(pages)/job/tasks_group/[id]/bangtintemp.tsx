"use client"

import { Card } from "primereact/card"
import { useRef, useState } from "react";
import FormInsert from "./formInsert";

import { OverlayPanel } from "primereact/overlaypanel";
import { MenuItem } from "@/resources/components/UI";
import HEADER_MENU from '@/assets/configs/header_menu'
import { MenuItemType } from "@/assets/types/menu";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import API from "@/assets/configs/api";
import * as request from "@/assets/helpers/request";
import { FormRefType, TypeSelected } from "@/assets/types/form";
import Link from "next/link";
import { toast } from "react-toastify";
import Confirm from "@/resources/components/UI/Confirm";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { useRouter } from "next/compat/router";
import { typeTeacherReSearch } from "@/assets/configs/general";

const key = "công việc";
const BangTinTemp = ({ reSearch, onSuccess }: { reSearch?: ReSearchType, onSuccess: () => void }) => {

    const router = useRouter()

    const actionsModalRef = useRef<OverlayPanel>(null);
    const [setlected, setSelected] = useState<TypeSelected<JobAll>>()
    const formRef = useRef<FormRefType<JobAll>>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);

    const JobCommitAssignment = useMutation<any, AxiosError<ResponseType>, JobAll>({
        mutationFn: (data) => {
            return request.update<JobAll>(API.job.CommitJobForStudent + data?.id, undefined);
        },
    });
    const handleDuyetDeTai = (data: JobAll) => {
        JobCommitAssignment.mutate(data, {
            onSuccess: (_: any) => {
                toast.success("Đã duyệt đề tài:" + data?.name);
                onSuccess
            },
        })
    }

    const handleClickAction = (item: MenuItemType, job: JobAll) => {
        if (item.code === "update") {
            formRef.current?.show?.(job);
            setSelected({ type: "edit", data: job })
        }
        if (item.code === "commit") {
            confirmModalRef.current?.show?.("" as any, job, `Bạn có chắc muốn đánh dấu hoàn thành ${key} ${job.name}`);
        }
    }


    const itemTemplate = (job: JobAll, index: number) => {
        return (
            job?.id && <Card
                key={index}
                // subTitle={`Hết hạn: ${new Date(Date.now()).toLocaleString("vi-VN")}`}
                className="mb-2"
                style={{ marginLeft: "auto", width: "90%" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <div className="flex" style={{ alignItems: 'center' }}>
                        <i className="pi pi-book p-2 mx-2" style={{ color: "green", fontSize: "20px", borderRadius: "9999px", border: "2px solid green" }}></i>
                        <Link href={router?.pathname + "/" + job.id} >
                            <p>{reSearch?.researchTeachers?.find(tc => tc.typeTeacher.name === typeTeacherReSearch.gvhuongdan)?.teacher.name} vừa giao nhiệm vụ: {job.name}</p>
                        </Link>
                    </div>
                    <i className="pi pi-ellipsis-v" onClick={(e) => actionsModalRef?.current?.toggle(e)}></i>
                </div>
                <OverlayPanel ref={actionsModalRef} className='p-0'>
                    <ul>
                        {HEADER_MENU.CLASS_ROOM_MENU().map(item => <MenuItem key={item.code} item={{ ...item, onItemClick: (_item) => handleClickAction(_item, job) }} />)}
                    </ul>
                </OverlayPanel>
            </Card>
        );
    };
    const ListTemplate = ({ items }: { items?: JobAll[] }) => {
        if (!items || items.length === 0) return null;

        let list = items.map((thesis, index) => {
            return itemTemplate(thesis, index);
        });

        return <div className="grid grid-nogutter" style={{ width: '100%' }}>{list}</div>;
    };





    return reSearch && <div className="container" style={{ width: "75vw" }}>
        <div style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            paddingTop: "20%",
            maxWidth: "1000px",
            margin: "0 auto",
            position: "relative",
            backgroundImage: "url(https://gstatic.com/classroom/themes/Honors.jpg)"
        }}>
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '5%',
                    color: '#fff',
                    borderRadius: '8px'
                }}
            >
                <h2 >
                    {reSearch?.name}
                </h2>
                <h5>{reSearch?.code}</h5>
            </div>
        </div>
        <div className='flex mx-auto' style={{
            // margin: "auto",
            // marginLeft: "4.7rem",
            maxWidth: "1000px",
            // justifyContent: "space-between",
            marginTop: "1rem"
        }}>
            <Card className='col-3' style={{ maxHeight: "200px", position: "relative" }}>
                <b>
                    Nhiệm vụ đến hạn :
                    chỗ này bạn phải viết lại cái api get job nó có luôn cái thời gian hết hạn mới làm được chức năng trên
                </b>
                {/* <p>
                    Tuyệt vời bạn có 5 nhiệm vụ chưa hoàng thành
                </p> */}
                <p style={{ position: "absolute", bottom: "12px", right: "32px", cursor: "pointer", textDecorationLine: "underline" }} onClick={() => {
                    formRef.current?.show?.(reSearch.group?.id as any);
                    setSelected({ type: "create", data: undefined })
                }}  >Giao nhiệm vụ</p>
            </Card>
            {/* <div className='col-9' > */}
            <ListTemplate items={reSearch.group?.jobGroups} />
            {/* </div> */}
        </div>
        <FormInsert
            type={setlected?.type || "detail"}
            onSuccess={() => {
                // console.log("có chạy trang bảng tin")
                onSuccess()
            }}
            data={setlected?.data}
            title={`${setlected?.type === "detail" ?
                `Thông tin ${key} ${setlected?.data?.name || ""}`
                : setlected?.type === "create" ?
                    `Thêm ${key} mới` :
                    `Chỉnh sửa thông tin ${key} ${setlected?.data?.name || ""}`}`}
            ref={formRef} />
        <Confirm
            ref={confirmModalRef}
            onAccept={handleDuyetDeTai}
            acceptLabel={'confirm'}
            rejectLabel={'cancel'}
            type="comfirm"
        />
    </div>
}
// return sao bay
export default BangTinTemp