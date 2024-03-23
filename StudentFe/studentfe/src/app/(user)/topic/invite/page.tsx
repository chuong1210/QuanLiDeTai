"use client";

import { API, DEFAULT_PARAMS, ROUTES, ROWS_PER_PAGE } from "@/assets/config";
import { http } from "@/assets/helpers";
import { StudentParamType, StudentType } from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { MetaType, ResponseType } from "@/assets/types/httpRequest";
import Loader from "@/resources/components/UI/Loader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useRef, useState } from "react";
import InviteForm, { InviteFormRefType } from "./form";
import { Tooltip } from "primereact/tooltip";
import { ConfirmModalRefType, ConfirmModalType } from "@/assets/types/modal";
import { ConfirmModal } from "@/resources/components/modal";
import { useGetList } from "@/assets/useHooks/useGet";
import { toast } from "react-toastify";

const InvitePage = ({ params: { lng } }: PageProps) => {
  const formRef = useRef<InviteFormRefType>(null);
  const [selected, setSelected] = useState<StudentType>();
  const confirmModalRef = useRef<ConfirmModalRefType>(null);

  const [params, setParams] = useState<StudentParamType>(DEFAULT_PARAMS);

  const studentQuery = useGetList<StudentType[]>({
    module: "student_by_period",
    params,
  });

  const recallInviteMutate = useMutation({
    mutationFn: (id: number) => {
      return http.update(API.post.change_invite_status, {
        id,
        status: "C",
      });
    },
  });

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setParams((prev) => ({
      ...prev,
      pageSize: e.rows,
      currentPage: e.first + 1,
    }));
  };

  const renderActions = (data: StudentType) => {
    return (
      <div className="flex align-items-center justify-content-center gap-3">
        {data.status == "S" && (
          <i
            data-pr-tooltip="Thu hồi lời mời"
            className="pi pi-replay send-invite hover:text-red-500 cursor-pointer"
            onClick={(e) => {
              confirmModalRef.current?.show?.(
                e,
                data,
                `Bạn có muốn hủy lời mời tới ${data.name}`
              );

              setSelected(data);
            }}
          />
        )}

        {data.status == "N" && (
          <i
            data-pr-tooltip="Gửi lời mời"
            className="pi pi-envelope send-invite hover:text-primary cursor-pointer"
            onClick={() => {
              formRef.current?.show?.(data);
              setSelected(data);
            }}
          />
        )}

        <Tooltip target=".send-invite" />
        <Tooltip target=".send-invite" />
      </div>
    );
  };

  const onRemove = (data: StudentType) => {
    recallInviteMutate.mutate(data.id!, {
      onSuccess: () => {
        toast.success("Thu hồi lời mời thành công");
      },
    });
  };

  return (
    <div className="flex flex-column gap-4">
      <div className="flex align-items-center justify-content-between bg-white h-4rem px-3 border-round-lg shadow-3">
        <p className="text-xl font-semibold">{"List of student"}</p>
      </div>

      <div className="flex align-items-center justify-content-between">
        <InputText placeholder={"search"} className="w-20rem" />
      </div>

      <div className="border-round-xl overflow-hidden relative shadow-5">
        <Loader
          show={studentQuery.isFetching || recallInviteMutate.isPending}
        />

        <DataTable
          value={studentQuery.response?.data || []}
          rowHover={true}
          stripedRows={true}
          showGridlines={true}
          emptyMessage={"List hiện trống"}
        >
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            header={"Thao tác"}
            body={renderActions}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            field="internalCode"
            header={"Mã sinh viên"}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            field="name"
            header={"Tên sinh viên"}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            field="email"
            header={"Email"}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            field="phoneNumber"
            header={"SĐT"}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            field="class"
            header={"Lớp học"}
          />
        </DataTable>

        <div className="flex align-items-center justify-content-between bg-white px-3 py-2">
          <div></div>

          <Paginator
            first={http.currentPage(studentQuery.response?.extra?.currentPage)}
            rows={studentQuery.response?.extra?.pageSize}
            totalRecords={studentQuery.response?.extra?.totalCount}
            rowsPerPageOptions={ROWS_PER_PAGE}
            onPageChange={onPageChange}
            className="border-noround p-0"
          />
        </div>
      </div>

      <InviteForm
        title={`Gửi lời mới tới ${selected?.name}`}
        ref={formRef}
        onSuccess={(data) => studentQuery.refetch()}
      />

      <ConfirmModal
        ref={confirmModalRef}
        onAccept={onRemove}
        acceptLabel={"Xác nhận"}
        rejectLabel={"Hủy bỏ"}
      />
    </div>
  );
};

export default InvitePage;
