"use client";

import { API, DEFAULT_PARAMS, ROUTES, ROWS_PER_PAGE } from "@/assets/config";
import { http } from "@/assets/helpers";
import {
  NotificationTypeInvitationInsertInput,
  StudentParamType,
  StudentType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { MetaType, ResponseType } from "@/assets/types/httpRequest";
import Loader from "@/resources/components/UI/Loader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Fragment, useRef, useState } from "react";
import InviteForm, { InviteFormRefType } from "./form";
import { Tooltip } from "primereact/tooltip";
import { ConfirmModalRefType, ConfirmModalType } from "@/assets/types/modal";
import { ConfirmModal } from "@/resources/components/modal";
import { useGetList, useGetListWithPagination } from "@/assets/useHooks/useGet";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import SearchForm from "./_invite/searchForm";
import { Checkbox } from "primereact/checkbox";
import CustomCheckbox from "@/resources/components/form/Checkbox";
import { classNames } from "primereact/utils";
import { boolean } from "yup";
import { handleInvitation } from "@/assets/config/apiRequests/StudentApiMutation";
import { Dialog } from "primereact/dialog";
import { useUserStore } from "@/assets/zustand/user";

const InvitePage = ({ params: { id } }: PageProps) => {
  const [selectedRows, setSelectedRows] = useState<StudentType[]>([]);
  const formRef = useRef<InviteFormRefType>(null);
  const [selected, setSelected] = useState<StudentType>();

  // const confirmCancelModalRef = useRef<ConfirmModalRefType>(null);
  const confirmInviteModalRef = useRef<ConfirmModalRefType>(null);
  const [errorModalVisible, setErrorModalVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [params, setParams] = useState<StudentParamType>(DEFAULT_PARAMS);
  const [totalElements, setTotalElements] = useState<number>(0);

  const { user, hasGroup, setUser, setHasGroup } = useUserStore();
  ("use server");
  const studentQuery = useGetListWithPagination<StudentType>({
    module: "student",
    params,
    _onSuccessPaginator: (data) => {
      setParams((prev) => {
        const newParams = {
          ...prev,

          currentPage: data.result?.currentPage,
          pageSize: data.result?.pageSize,
          totalPages: data.result?.totalPages,
          totalElements: data.result?.totalElements,
        };
        // Only update state if params have actually changed to avoid unnecessary re-renders
        if (JSON.stringify(prev) !== JSON.stringify(newParams)) {
          return newParams;
        }
        return prev;
      });
      setTotalElements(data.result?.totalElements || 0);
    },
  });

  ("use server");
  const studentQuerySelect = useGetList<StudentType>({
    module: "student_toSelect",
  });
  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setParams((prev) => ({
      ...prev,
      page: e.rows,
      currentPage: e.first + 1,
    }));
  };
  const handleInvitationSuccess = (studentJoinId: number) => {
    // Update the student's status in the database
    http
      .update(`${API.put.student}/${studentJoinId}`, { status: "S" })
      .then(() => {
        // Refetch data to update the DataTable
        studentQuerySelect.refetch();
      });
  };

  const inviteMutation: any = useMutation<
    any,
    AxiosError<ResponseType>,
    NotificationTypeInvitationInsertInput
  >({
    mutationFn: (data: NotificationTypeInvitationInsertInput) => {
      return handleInvitation(data);
    },
    onSuccess: () => {
      toast.success("Đã gửi lời mời!");
      studentQuery.refetch();
    },
    onError: (error: AxiosError<ResponseType>) => {
      console.log(error);
      if (error.response?.data.code === 1059) {
        setErrorMessage(
          error.response?.data.message ||
            "Bạn chưa có nhóm nên ko thể gửi lời mời"
        );
        setErrorModalVisible(true);
      } else {
        console.error("Error sending invitations:", error);
      }
    },
  });
  const renderActions = (data: StudentType) => {
    return (
      <div className="flex align-items-center justify-content-center gap-3">
        {data.status === "S" &&
          !selectedRows.some((row) => row.id === data.id) && (
            <Fragment>
              {/* <i
                key={`cancel-${data.id}`} // Add key here
                data-pr-tooltip="Thu hồi lời mời"
                className="pi pi-replay hover:text-red-500 cursor-pointer cancelInvite"
                onClick={(e) => {
                  confirmCancelModalRef.current?.show?.(
                    e,
                    data,
                    `Bạn có muốn hủy lời mời tới ${data.name}`
                  );

                  setSelected(data);
                }}
              />
              <Tooltip target=".cancelInvite" /> */}
            </Fragment>
          )}

        {selectedRows.some((row) => row.id === data.id) && (
          <Fragment>
            <i
              key={`send-${data.id}`} // Add key here
              data-pr-tooltip="Gửi lời mời"
              className="pi pi-envelope hover:text-primary cursor-pointer sentInvite"
              onClick={() => {
                formRef.current?.show?.(data, selectedRows);
                setSelected(data);
              }}
            />
            <Tooltip target=".sentInvite" />
          </Fragment>
        )}
      </div>
    );
  };
  // const recallInviteMutate = useMutation({
  //   mutationFn: (id: number) => {
  //     return http.update(API.post.change_invite_status, {
  //       id,
  //       status: "C",
  //     });
  //   },
  // });
  // const onRemove = (data: StudentType) => {
  //   recallInviteMutate.mutate(data.id!, {
  //     onSuccess: () => {
  //       toast.success("Thu hồi lời mời thành công");
  //     },
  //   });
  // };
  const onRowSelect = (event: { data: StudentType }) => {
    setSelectedRows([...selectedRows, event.data]);
  };

  const onRowUnselect = (event: { data: StudentType }) => {
    setSelectedRows(selectedRows.filter((row) => row.id !== event.data.id));
  };
  return (
    <div className="flex flex-column gap-4">
      <div className="flex align-items-center justify-content-between bg-white h-4rem px-3 border-round-lg shadow-3">
        <p className="text-xl font-semibold">Danh sách sinh viên</p>
      </div>

      <div className="flex align-items-center ">
        <SearchForm id="searchForm" blockClassName="w-20rem center flex  " />
        {selectedRows.length > 1 && (
          <Fragment>
            <Button
              key={`send-${selectedRows.map((row) => row.id)}`} // Add key here
              // data-pr-tooltip="Gửi lời mời"
              size="small"
              className="pi pi-envelope pl-4 ml-3  hover:text-primary cursor-pointer sentInvite"
              onClick={(e) => {
                confirmInviteModalRef.current?.show?.(
                  e,

                  selectedRows,
                  `Bạn có muốn gửi tất cả lời mời tới ${selectedRows.map(
                    (rows) => rows.name
                  )}`
                );
              }}
            />
            <Tooltip
              position="bottom"
              content="Gửi lời mời"
              target=".sentInvite"
            />
          </Fragment>
        )}
      </div>

      <div className="border-round-xl overflow-hidden relative shadow-5">
        <Loader show={studentQuerySelect.isFetching} />

        <DataTable
          value={studentQuerySelect.data?.result || []}
          rowHover={true}
          stripedRows={true}
          showGridlines={true}
          emptyMessage={"Danh sách sinh viên hiện trống"}
          dataKey="id"
          //
          selectionMode="multiple"
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
          onRowSelect={onRowSelect}
          onRowUnselect={onRowUnselect}
          rowClassName={(data: StudentType) =>
            classNames({
              "highlighted-row": selectedRows.some((row) => row.id === data.id),
            })
          }
        >
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
              
            }}
            bodyStyle={{
              textAlign: "center",
            }}
            align={"center"}
            header={
              <i className="pi pi-user-edit" style={{ fontSize: "1.5rem" }}></i>
            }
            body={(data: StudentType) => (
              <div className="flex align-items-center justify-content-center gap-3">
                <CustomCheckbox
                  id="checkboxInvite"
                  value={selectedRows.some((row) => row.id === data.id)}
                />
              </div>
            )}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            field="id"
            align={"center"}
            className="center"
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
            field="code"
            header={"Lớp học"}
          />

          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            align={"center"}
            className="center"
            header={"Thao tác"}
            body={renderActions}
          />
        </DataTable>

        <div className="flex align-items-center justify-content-between bg-white px-3 py-2">
          <div></div>

          <Paginator
            first={http.currentPage(studentQuery.data?.result?.currentPage)}
            rows={studentQuery.data?.result?.pageSize}
            totalRecords={studentQuery.data?.result?.totalPages}
            rowsPerPageOptions={ROWS_PER_PAGE}
            onPageChange={onPageChange}
            className="border-noround p-0"

            // first={(params.currentPage - 1) * params.pageSize}
            // rows={params.pageSize}
            // totalRecords={totalElements}
            // rowsPerPageOptions={ROWS_PER_PAGE}
            // onPageChange={onPageChange}
            // className="border-noround p-0"
          />
        </div>
      </div>

      <InviteForm
        title={`Gửi lời mới tới ${selected?.name}`}
        ref={formRef}
        onSuccess={(result) => studentQuery.refetch()}
        onUpdateStudent={handleInvitationSuccess}
      />
      {/* 
      <ConfirmModal
        ref={confirmCancelModalRef}
        onAccept={onRemove}
        acceptLabel={"Xác nhận"}
        rejectLabel={"Hủy bỏ"}
      /> */}

      <ConfirmModal
        ref={confirmInviteModalRef}
        onAccept={() => {
          const studentIds: number[] = selectedRows
            .map((student) => {
              if (student.id !== undefined) {
                return student.id;
              }
            })
            .filter((id) => id !== undefined) as number[];

          const invitationData: NotificationTypeInvitationInsertInput = {
            studentIds: studentIds,
            isSendAllStudent: false,
          };

          // Trigger the mutation with the invitation data for all selected students
          inviteMutation.mutate(invitationData, {
            onSuccess: () => {
              toast.success("Đã gửi lời mời!");
              studentQuery.refetch();
            },
            onError: () => {
              console.error("Error sending invitations:");
            },
          });
        }}
        acceptLabel={"Xác nhận"}
        rejectLabel={"Hủy bỏ"}
      />
      <Dialog
        header="Error"
        visible={errorModalVisible}
        style={{ width: "50vw" }}
        onHide={() => setErrorModalVisible(false)}
      >
        <p>{errorMessage}</p>
      </Dialog>
    </div>
  );
};

export default InvitePage;
