"use client";

import {
  useGetDetail,
  useGetList,
  useGetListWithPagination,
} from "@/assets/useHooks/useGet";
import {
  AuthType,
  GroupParamType,
  GroupType,
  JobParamType,
  JobType,
  NotificationTypeInvitationInsertInput,
  StudentParamType,
  StudentType,
  TopicType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { OptionType } from "@/assets/types/common";
import { Loader } from "@/resources/components/UI";
import { classNames } from "primereact/utils";
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MemberTab,
  ExerciseTab,
  NewsTab,
  ResultTab,
  TeamPageTab,
  JobPlanTab,
} from "../_tab";
import Link from "next/link";
import { Button } from "primereact/button";
import { DEFAULT_PARAMS, ROUTES, ROWS_PER_PAGE } from "@/assets/config";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomCheckbox from "@/resources/components/form/Checkbox";
import { ConfirmModal } from "@/resources/components/modal";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
  handleInvitation,
  registerGroup,
} from "@/assets/config/apiRequests/StudentApiMutation";
import { Panel } from "primereact/panel";
import { Avatar } from "primereact/avatar";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { InputNumber } from "primereact/inputnumber";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { http } from "@/assets/helpers";
import { useUserStore } from "@/assets/zustand/user";
import { Fieldset } from "primereact/fieldset";
import { IconField } from "primereact/iconfield";
import styled from "styled-components";
import { Divider } from "primereact/divider";

type GroupPageContextType = {
  id: number;
  topic?: TopicType | null;
  jobs?: JobType[];
  active: string;
  groupDetail?: GroupType;
  setActiveTab: (value: string) => void;
  setGroupDetail: (value: GroupType) => void;
};

const GroupPageContext = createContext<GroupPageContextType>({
  id: 0,
  topic: null,
  jobs: [],
  active: "news",
  setActiveTab: (value: string) => {},
  setGroupDetail: (value: GroupType) => {},
});
// const StyledFieldset = styled(Fieldset)`
//   .p-fieldset-toggle {
//     display: none !important; /* Hide the toggle icon */
//   }

//   .p-fieldset-toggleable .p-fieldset-toggler {
//     display: none !important; /* Hides the toggle icon */
//   }
// `;
const GroupPage = ({ params }: PageProps) => {
  const { id, hg } = params;
  const searchParams = useSearchParams();
  const { user, hasGroup, setUser, setHasGroup } = useUserStore();
  // const { active } = useContext(GroupPageContext);
  // useEffect(() => {
  //   setHasGroup(hasGroupFromParams);
  // }, [hasGroupFromParams, setHasGroup]);
  const [groupDetailValue, setGroupDetailValue] = useState<
    GroupType | undefined
  >(undefined);
  const idStudent: string = user?.student?.id ? user.student.id.toString() : "";
  const [selectedRows, setSelectedRows] = useState<StudentType[]>([]);
  const confirmModalRef = useRef<ConfirmModalRefType>(null);
  const [activeTab, setActiveTab] = useState<string>("news");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [paramsStudent, setParamsStudent] =
    useState<StudentParamType>(DEFAULT_PARAMS);
  const [selectedGroupSize, setSelectedGroupSize] = useState<number>(1); // Initial group size
  const handleCreateGroup = () => {
    if (selectedRows.length >= 0) {
      setShowConfirmation(true); // Show the confirmation dialog
    }
  };

  const studentQuery = useGetListWithPagination<StudentType>({
    module: "student",
    params: paramsStudent,
    enabled: !hasGroup,
  });
  const studentQuerySelect = useGetList<StudentType>({
    module: "student_toSelect",
  });
  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setParamsStudent((prev) => ({
      ...prev,
      page: e.rows,
      limit: e.first + 1,
    }));
  };
  const groupDetail = useGetDetail<GroupType>({
    module: "group",
    // params: {
    //   id,
    //   isAllDetail: true,
    // },
    // enabled: hasGroup,
  });

  const groupBoolean: boolean = !!groupDetail?.data?.result?.id;

  const topicDetail = useGetDetail<TopicType>({
    module: "topic",
    params: {
      id: groupDetail.response?.result?.thesisDto?.id,
      isAllDetail: true,
    },
    enabled: !!groupDetail.response?.result?.thesisDto?.id,
  });

  const jobDetail = useGetList<JobType, JobParamType>({
    module: "job",
    params: {
      thesisId: groupDetail.response?.result?.thesisDto?.id,
      isAllDetail: true,
    },
    enabled: !!groupDetail.response?.result?.thesisDto?.id,
  });
  const inviteMutation: any = useMutation<
    any,
    AxiosError<ResponseType>,
    NotificationTypeInvitationInsertInput
  >({
    mutationFn: (data: NotificationTypeInvitationInsertInput) => {
      return handleInvitation(data);
    },
    // onSuccess: () => {
    //   studentQuery.refetch();
    // },
  });

  const onRowSelect = (event: { data: StudentType }) => {
    setSelectedRows([...selectedRows, event.data]);
  };

  const onRowUnselect = (event: { data: StudentType }) => {
    setSelectedRows(selectedRows.filter((row) => row.id !== event.data.id));
  };
  const confirmCreateGroup = async () => {
    try {
      if (selectedRows.length > 0) {
        const studentJoinId = selectedRows.map(
          (student) => student.id
        ) as number[];
        if (studentJoinId) {
          await registerGroup(selectedGroupSize);
          await inviteMutation.mutate(studentJoinId, {
            onSuccess: () => {
              toast.success("Đã gửi lời mời!");
              studentQuery.refetch();
              groupDetail.refetch();
            },
            onError: () => {
              console.error("Error sending invitations:");
            },
          });
        } // Call the API function
        // Handle success (e.g., show a success message, update state, redirect)
        console.log("Group created successfully!");
      } else {
        await registerGroup(selectedGroupSize);
      }
      // ... your success handling logic
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error creating group:", error);
      // ... your error handling logic
    } finally {
      setShowConfirmation(false);
      setShowPanel(false); // Close the panel after creation // Hide the confirmation dialog
      setHasGroup(true);
      // setUser({
      //   ...user, // Giữ lại tất cả thuộc tính khác của user
      //   id: idStudent, // Thay đổi id
      // })
      localStorage.setItem("hasGroup", JSON.stringify(true));
    }
  };

  const legendTemplate = (
    <div
      className="flex align-items-center gap-2 px-2  "
      style={{ userSelect: "none" }}
    >
      <Avatar icon=" pi pi-users" shape="circle" />
      <span className="font-bold">Tạo nhóm</span>
    </div>
  );
  const headerTemplate = () => {
    return (
      <div className=" flex-auto flex-wrap gap-3 p-fluid max-h-full">
        <label htmlFor="stacked-buttons" className="font-bold block mb-2">
          Chọn số lượng:
        </label>
        <InputNumber
          value={selectedGroupSize}
          onValueChange={(e) => setSelectedGroupSize(e.value || 1)}
          min={1} // Set a minimum value
          max={10} // Set a maximum value (adjust as needed)
          mode="decimal"
          className="max-w-20rem b"
          buttonLayout="horizontal"
          showButtons
        />
        <Button
          rounded
          outlined
          severity="info"
          aria-label="Favorite"
          icon="pi pi-users"
          label="Tạo nhóm"
          onClick={handleCreateGroup}
          className="ml-3 max-w-10rem"
        />
      </div>
    );
  };

  const TABS: OptionType[] = useMemo(() => {
    const baseTabs = [
      {
        value: "exercise",
        label: "Công việc",
      },
      {
        value: "member",
        label: "Nhóm",
      },
      {
        value: "job",
        label: "Bài tập",
      },
    ];

    return groupDetail.data?.result?.leaderId === idStudent
      ? [
          ...baseTabs,
          {
            value: "team",
            label: "Xem thành viên",
          },
          {
            value: "point",
            label: "Điểm",
          },
        ]
      : baseTabs;
  }, [groupDetail.data, idStudent]);
  const value: GroupPageContextType = {
    id,
    topic: topicDetail.response?.result,
    jobs: jobDetail.response?.result || [],
    active: activeTab,
    groupDetail: groupDetail.data?.result || undefined,
    // hasGroup: contextHasGroup,
    // setHasGroup,
    setActiveTab,
    setGroupDetail: setGroupDetailValue,
  };

  return groupDetail.data?.result ? (
    <GroupPageContext.Provider value={value}>
      <Loader show={topicDetail.isFetching || jobDetail.isFetching} />
      <div className="header justify-content-between flex flex-row  align-items-center mr-3  ">
        {/* base line cung dc */}
        <h1>Thao tác trong nhóm & đăng ký đề tài</h1>

        {groupDetail.data &&
          groupDetail.data.result &&
          groupDetail.data.result.students &&
          groupDetail.data.result.students.length < 10 && (
            <Fragment>
              <Link href={ROUTES.topic.invite} className="inline-block">
                <Button
                  label="Mời thêm thành viên vào nhóm"
                  className="p-button-outlined p-button-secondary max-h-3rem "
                  style={{ float: "right", borderRadius: "1rem 16px" }}
                />
              </Link>
            </Fragment>
          )}
      </div>

      {/* {typeof groupDetail.data?.result?.countMember === "number" || */}

      {/* {+(groupDetail.data?.result?.countMember || 0) <= 4} */}
      {/* {parseInt(String(groupDetail.data?.result?.countMember || "0"), 10) <=
        4 && (
        <Fragment>
          <Link href={ROUTES.topic.invite}>
            <Button className="p-button p-component p-2">Mời thành viên</Button>
          </Link>
        </Fragment>
      )} */}
      <div className="flex  align-items-center border-bottom-2 border-200 bg-white border-round overflow-hidden">
        {TABS.map((tab) => (
          <div
            key={tab.value}
            className={classNames(
              "px-5 py-3 cursor-pointer hover:text-primary border-bottom-3 border-transparent font-semibold",
              {
                "text-900": tab.value != activeTab,
                "text-primary border-primary": tab.value === activeTab,
              }
            )}
            onClick={() => setActiveTab(tab.value?.toString()!)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div
        className="mt-3"
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {/* {activeTab === "news" && <NewsTab />} */}
        {activeTab === "exercise" && <ExerciseTab />}
        {activeTab === "member" && <MemberTab />}
        {activeTab === "point" && <ResultTab />}
        {activeTab === "job" && <JobPlanTab />}

        {activeTab === "team" && <TeamPageTab />}
      </div>
    </GroupPageContext.Provider>
  ) : (
    <div className=" gap-3">
      <div className="block ">
        <DataTable
          value={studentQuerySelect.data?.result || []}
          rowHover={true}
          className=" max-w-full w-full border-round-top-2xl  "
          // cellClassName={}
          stripedRows={true}
          style={{ overflow: "hidden" }}
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
              width: "140px",
            }}
            header={
              <i className="pi pi-user-edit" style={{ fontSize: "1.5rem" }}></i>
            }
            body={(data: StudentType) => (
              <div className="flex align-items-center justify-content-center gap-3">
                <CustomCheckbox
                  id="checkboxInvite"
                  value={selectedRows.some((row) => row.id === data.id)}
                  onChange={() => {}}
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
              textAlign: "center",
            }}
            bodyStyle={{
              textAlign: "center",
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
              textAlign: "center",
            }}
            bodyStyle={{
              textAlign: "center",
            }}
            field="id"
            align={"center"}
            className="center"
            header={"Code"}
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
      <Divider />
      <Fieldset
        legend={legendTemplate}
        toggleable
        className="block overflow-hidden "
      >
        {headerTemplate()}
        {/* {selectedRows.length > 0 && (
          <div className="mt-2 p-3 ">
            <h1 className=" text-2xl font-bold">
              Đồng ý tạo nhóm và gửi lời mời đến {selectedRows.length} thành
              viên
            </h1>
          </div>
        )} */}
      </Fieldset>

      <ConfirmDialog // Add the ConfirmDialog component
        visible={showConfirmation}
        onHide={() => setShowConfirmation(false)}
        message={
          selectedRows.length > 0
            ? "Bạn có chắc muốn tạo nhóm và gửi các lời mời vào nhóm trên?"
            : "Bạn có chắc muốn tạo nhóm không gửi lời mời vào nhóm?"
        }
        header="Xác nhận"
        icon="pi pi-exclamation-triangle"
        accept={confirmCreateGroup}
        reject={() => {}}
      />
    </div>
  );
};

export default GroupPage;
export { GroupPageContext };
