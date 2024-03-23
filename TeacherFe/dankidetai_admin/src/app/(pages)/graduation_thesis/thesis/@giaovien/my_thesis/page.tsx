'use client'

import { FormRefType, TypeSelected } from "@/assets/types/form";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { Button } from "primereact/button"
import { useRef, useState } from "react";
import Form from "./form";
import Confirm from "@/resources/components/UI/Confirm";
export const key = "dề tài"
export default function Page() {
  const [setlected, setSelected] = useState<TypeSelected<ThesisType>>()
  const formRef = useRef<FormRefType<ThesisType>>(null);
  const confirmModalRef = useRef<ConfirmModalRefType>(null);

  return (
    <div>
      <Confirm
        ref={confirmModalRef}
        // onAccept={onRemove}
        acceptLabel={'confirm'}
        rejectLabel={'cancel'}
      />

      <h3>Thực hiện thêm {key} vào hệ thống</h3>

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
        // onSuccess={() => teacherListQuery.refetch()}
        title={`${setlected?.type === "detail" ?
          `Thông tin ${key} ${setlected?.data?.name || ""}`
          : setlected?.type === "create" ?
            `Thêm ${key} mới` :
            `Chỉnh sửa thông tin ${key} ${setlected?.data?.name || ""}`}`}
        ref={formRef} />


    </div>
  )
}
