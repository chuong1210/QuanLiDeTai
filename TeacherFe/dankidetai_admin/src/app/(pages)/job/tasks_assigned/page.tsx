'use client'

import { useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as request from "@/assets/helpers/request"
import API from "@/assets/configs/api";
import ROUTER from "@/assets/configs/routers";
import { Card } from "primereact/card";
import moment from "moment";
import { OverlayPanel } from "primereact/overlaypanel";
import header_menu from "@/assets/configs/header_menu";
import { MenuItem } from "@/resources/components/UI";
import { MenuItemType } from "@/assets/types/menu";
import success_img from "@/resources/image/system/success_img.png"
import progress_img from "@/resources/image/system/progress.png"
import Image from "next/image";
import { Tag } from "primereact/tag";
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

    const ListMyJobQuery = useQuery<JobAll[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['my-list-job'],
        queryFn: async () => {
            const response = await request.get<JobAll[]>(API.job.ShowMyJob);
            let responseData: any = response.data ?? [];
            console.log(responseData)
            return responseData?.result;
        }
    });
    const actionsModalRef = useRef<OverlayPanel>(null);



    const handleClickAction = (item: MenuItemType, job: JobAll) => {
        if (item.code === "update") {
        }
    }

    // const itemTemplate = (thesis: JobAll, index: number) => {
    //     return (
    //         thesis?.id && <div className="col-12" key={index} style={{ padding: '8px 0' }}>
    //             <div className={`flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 border-round ${index !== 0 ? 'border-top-1 surface-border' : ''}`} style={{ backgroundColor: 'white', border: '1px solid #ccc', position: 'relative' }}>
    //                 <div className="flex flex-column align-items-center sm:align-items-start gap-3 col-8">
    //                     <div
    //                         className=" text-2xl font-bold text-800"
    //                         style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-word', fontSize: '1.2rem' }} // Giảm font-size cho tiêu đề
    //                     >
    //                         <Link href={`${ROUTER.job.tasks_assigned}/${thesis.id}`} style={{ cursor: "pointer", display: 'block', minWidth: '50vw' }}>
    //                             {thesis.name}
    //                         </Link >

    //                     </div>
    //                     {thesis.name === jobTBMGV ? <Link href={`${ROUTER.graduation_thesis.thesis.my_thesis}`} > <Button className="my-2" style={{ minWidth: "120px", textAlign: "center", justifyContent: "center" }}>Ra đề tài</Button>
    //                     </Link>
    //                         :
    //                         <Link href={`${ROUTER.job.tasks_assignment}`} > <Button className="my-2" style={{ minWidth: "120px", textAlign: "center", justifyContent: "center" }}>Giao nhiệm vụ</Button>
    //                         </Link>
    //                     }
    //                 </div>
    //             </div>
    //         </div >
    //     );
    // };
    const itemTemplate = (thesis: JobAll, index: number) => {
        return (
            thesis?.id &&

            <Card
                key={index}
                className="mb-2"
                style={{
                    marginRight: "auto", width: "60%",
                    // backgroundImage: `${success_img}`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "calc(100% - 100px) 0px",
                }}
            // ={<Image alt="" src={success_img} />}
            >

                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <div className="flex" style={{ alignItems: 'center' }}>
                        <i className="pi pi-book p-2 mx-2" style={{ color: "green", fontSize: "20px", borderRadius: "9999px", border: "2px solid green" }}></i>
                        <div>
                            <Link href={`${ROUTER.job.tasks_assigned}/${thesis.id}`} style={{ cursor: "pointer", display: 'block' }}>
                                {thesis.name}
                            </Link >
                            <div >

                                <p className="">{moment(thesis.from, 'YYYY-MM-DD HH:mm:ss.SSSSSS').format('D [thg] M, YYYY')}
                                </p>
                                {/* {
                                    thesis.quantityRequirement && thesis.quantityCompleted && thesis.quantityRequirement <= thesis.quantityCompleted ?
                                        <Tag severity={'success'}>Hoàn thành</Tag> :
                                        <Tag severity={"warning"}> Chưa hoàn tất</Tag>
                                } */}
                            </div>
                        </div>
                    </div>
                    {/* <div>chi hihi</div> */}


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


            {
                ListMyJobQuery.data && ListMyJobQuery.data?.length > 0 ? <div><h2>Nhiệm vụ hiện tại của bạn : </h2>{listTemplate(ListMyJobQuery.data)}</div> : <h2>Tuyệt vời bạn không có công việc nào được giao</h2>
            }



        </div >
    )
}
