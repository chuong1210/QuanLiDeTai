'use client'

import { FormRefType, TypeSelected } from "@/assets/types/form";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { Button } from "primereact/button"
import { useRef, useState } from "react";
import Form from "./form";
import Confirm from "@/resources/components/UI/Confirm";
export const key = "dề tài"
export default function Page() {
  const [teacherOnExcel, setTeacherOnExcel] = useState<ThesisType[]>([])
  const [setlected, setSelected] = useState<TypeSelected<ThesisType>>()
  const formRef = useRef<FormRefType<ThesisType>>(null);
  const confirmModalRef = useRef<ConfirmModalRefType>(null);

  return (
    <div>
      {/* {teacherListQuery.isFetching || teacherListMutation.isPending && <Loader />} */}
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
        {/* <DataTable
          value={(teacherListQuery.data?.length === 0 || teacherListQuery.data === undefined) ? teacherOnExcel : teacherListQuery.data}
          rowHover={true}
          stripedRows={true}
          showGridlines={true}
          emptyMessage={'list_empty'}
        >
          {
            teacherOnExcel.length === 0 &&
            <Column
              alignHeader='center'
              headerStyle={{
                background: 'var(--bluegray-100)',
                color: 'var(--bluegray-900)',
                whiteSpace: 'nowrap',
              }}
              header={'Lựa chọn'}
              body={renderActions}
            />
          }

          {fields.map((field, index) => <Column
            key={index}
            alignHeader='center'
            headerStyle={{
              background: 'var(--bluegray-100)',
              color: 'var(--bluegray-900)',
              whiteSpace: 'nowrap',
            }}
            field={field.code}
            header={field.field}
          />)}


        </DataTable> */}

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
