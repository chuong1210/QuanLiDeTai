'use client'

import { FormRefType, TypeSelected } from "@/assets/types/form";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { Button } from "primereact/button"
import { useRef, useState } from "react";
import Form from "./form";
import Confirm from "@/resources/components/UI/Confirm";
import { Tag } from "primereact/tag";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { request } from "@/assets/helpers/request";
import API from "@/assets/configs/api";
export const key = "dề tài"

export default function Page() {
  const [setlected, setSelected] = useState<TypeSelected<ReSearchType>>()
  const formRef = useRef<FormRefType<ReSearchType>>(null);
  const confirmModalRef = useRef<ConfirmModalRefType>(null);
  const ListResearchListQuery = useQuery<ReSearchType[], AxiosError<ResponseType>>({

    queryKey: ['list-Research'],
    queryFn: async () => {

      const response: any = await request.get<ReSearchType[]>(`${API.reSearch.showall}?page=1&limit=100&orderBy=id&orderDirection=ASC`);
      console.log("Research list", response)
      let responseData = response.data ?? [];
      //console.log("  queryKey: ['list-Students'],", responseData.result)
      return responseData.result.responses || [];
    },
  });
  const itemTemplate = (thesis: ReSearchType, index: number) => {
    let status = "Approved"
    if (thesis.isApproved === 0) {
      status = "Not Approve"
    }
    return (
      <div className="col-12" key={thesis.maDeTai} style={{ padding: '8px 0' }}>
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
                <span className="font-semibold">{thesis.maDeTai}</span>
              </span>
              <Tag value={status} severity={status === 'Not Approve' ? 'danger' : 'success'}></Tag>
            </div>
          </div>
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-2 gap-3 col-4" style={{ minHeight: "120px" }}>
            <div className="flex flex-column align-items-center sm:align-items-start gap-3" style={{ fontSize: '1rem' }}> {/* Giảm font-size cho các thông tin giảng viên và nhóm chuyên ngành */}
              <div className="flex align-items-center gap-3">
                <span className="font-semibold">Giảng viên:</span> {thesis.teachers.map(item => item.name + ",")}
              </div>
              <div className="flex align-items-center gap-3">
                <span className="font-semibold">Số lượng TV:</span> {thesis.minMembers}-{thesis.maxMembers}
              </div>
              <div className="flex align-items-center gap-3">
                <span className="font-semibold">Nhóm chuyên ngành:</span> {thesis.subjects.map(item => item.name + ",")}
              </div>
            </div>
            <div className="flex gap-2 sm:gap-1" style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
              <span style={{ textDecoration: "underline", fontSize: '1rem', marginRight: "2px", cursor: "pointer" }} onClick={() => {
                formRef.current?.show?.(thesis);
                setSelected({ type: "edit", data: thesis })
              }}>Thay đổi</span>
              <Link style={{ textDecoration: "underline", fontSize: '1rem' }} href={`/graduation_thesis/thesis/${thesis.id}`}>Chi tiết</Link> {/* Giảm font-size cho liên kết */}
            </div>
          </div>
        </div>
      </div >
    );
  };


  const listTemplate = (items: ReSearchType[]) => {
    console.log(items)
    if (!items || items.length === 0) return null;

    let list = items.map((thesis, index) => {
      return itemTemplate(thesis, index);
    });

    return <div className="grid grid-nogutter" style={{ width: '100%' }}>{list}</div>;
  };
  return (
    <div>
      <Confirm
        ref={confirmModalRef}
        // onAccept={onRemove}
        acceptLabel={'confirm'}
        rejectLabel={'cancel'}
      />

      <h3>Thêm {key} vào hệ thống</h3>

      <Button
        label={`Thêm ${key} mới`}
        icon='pi pi-plus'
        size='small'
        className="my-3"
        onClick={() => {
          formRef.current?.show?.();
          setSelected({ type: "create", data: undefined })
        }}
      />
      <div className="my-3">
      </div>
      <Form
        type={setlected?.type || "detail"}
        data={setlected?.data}
        onSuccess={() => ListResearchListQuery.refetch()}
        title={`${setlected?.type === "detail" ?
          `Thông tin ${key} ${setlected?.data?.name || ""}`
          : setlected?.type === "create" ?
            `Thêm ${key} mới` :
            `Chỉnh sửa thông tin ${key} ${setlected?.data?.name || ""}`}`}
        ref={formRef} />
      <div>
        <h3>Danh sách đề tài </h3>
        {ListResearchListQuery.data &&
          listTemplate(ListResearchListQuery.data)
        }

      </div>
    </div>
  )
}
