"use client"

import API from "@/assets/configs/api";
import { request } from "@/assets/helpers/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { Card } from "primereact/card"
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import FormInsert from "./formInsert";

// tạo hàm sao

const BangTinTemp = ({ reSearch }: { reSearch?: ReSearchType }) => {
    const formInsert = useRef<any>();
    const itemTemplate = (job: JobAll, index: number) => {
        return (
            job?.id && <div className="col-12" key={index} style={{ padding: '4px 0' }}>
                <div className={`flex flex-column xl:flex-row xl:align-items-start p-3 gap-4 border-round ${index !== 0 ? 'border-top-1 surface-border' : ''}`} style={{ backgroundColor: 'white', border: '1px solid #ccc', position: 'relative' }}>
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3 col-12">
                        <div
                            className="text-2xl font-bold text-800"
                            style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-word', fontSize: '1rem' }} // Giảm font-size cho tiêu đề
                        >
                            <p style={{ cursor: "pointer", display: 'block' }}>
                                {job.name}
                            </p >
                            {/* <Link href={`${ROUTER.job.tasks_assigned}/${thesis.id}`} style={{ cursor: "pointer", display: 'block', minWidth: '50vw' }}>
                                {thesis.name}
                            </Link > */}
                        </div>
                    </div>
                </div>
            </div >
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
        <div className='flex' style={{
            margin: "auto",
            marginLeft: "4.7rem",
            maxWidth: "1000px",
            justifyContent: "space-between",
            marginTop: "1rem"
        }}>
            <Card className='col-3' style={{ maxHeight: "200px", position: "relative" }}>
                <b>
                    Nhiệm vụ đến hạn :
                </b>
                {/* <p>
                    Tuyệt vời bạn có 5 nhiệm vụ chưa hoàng thành
                </p> */}
                <p style={{ position: "absolute", bottom: "12px", right: "32px", cursor: "pointer", textDecorationLine: "underline" }} onClick={() => {
                    // console.log(ListResearch?ListQuery?.data);
                    formInsert.current.show(reSearch.group?.id);
                }}  >Giao nhiệm vụ</p>
            </Card>
            <Card className='col-8' >
                <ListTemplate items={reSearch.group?.jobGroups} />
            </Card>
        </div>
        <FormInsert
            type="detail"
            title={"Giao nhiệm vụ"}
            onSuccess={() => { }}
            ref={formInsert}
        />
    </div>
}
// return sao bay
export default BangTinTemp