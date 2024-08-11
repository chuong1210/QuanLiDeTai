"use client";

import {
  useGetDetail,
  useGetList,
  useGetListWithPagination,
} from "@/assets/useHooks/useGet";
import {
  GroupParamType,
  GroupType,
  JobParamType,
  JobType,
  StudentParamType,
  StudentType,
  TopicType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { OptionType } from "@/assets/types/common";
import { Loader } from "@/resources/components/UI";
import { classNames } from "primereact/utils";
import { createContext, Fragment, useMemo, useRef, useState } from "react";
import { MemberTab, ExerciseTab, NewsTab, ResultTab } from "../_tab";
import Link from "next/link";
import { Button } from "primereact/button";
import { DEFAULT_PARAMS, ROUTES } from "@/assets/config";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomCheckbox from "@/resources/components/form/Checkbox";
import { ConfirmModal } from "@/resources/components/modal";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { registerGroup } from "@/assets/config/apiRequests/StudentApiMutation";
import { Panel } from "primereact/panel";
import { Avatar } from "primereact/avatar";

type GroupPageContextType = {
  id: number;
  topic?: TopicType | null;
  jobs?: JobType[];
  active: string;
};

const GroupPageContext = createContext<GroupPageContextType>({
  id: 0,
  topic: null,
  jobs: [],
  active: "news",
});

const GroupPage = ({ params }: PageProps) => {
  const { id } = params;
  const searchParams = useSearchParams();
  const hasGroup: boolean = searchParams?.get("hasGroup") === "true";
  const maSo: string = searchParams?.get("studentId") ?? "";
  const [selectedRows, setSelectedRows] = useState<StudentType[]>([]);
  const confirmModalRef = useRef<ConfirmModalRefType>(null);
  const [activeTab, setActiveTab] = useState<string>("news");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [paramsStudent, setParamsStudent] =
    useState<StudentParamType>(DEFAULT_PARAMS);

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

  const groupDetail = useGetDetail<GroupType>({
    module: "group",
    params: {
      id,
      isAllDetail: true,
    },
    enabled: id != "0",
  });

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
          (student) => student.maSo
        ) as string[];
        if (studentJoinId) await registerGroup(studentJoinId); // Call the API function
        // Handle success (e.g., show a success message, update state, redirect)
        console.log("Group created successfully!");
      } else {
        await registerGroup(maSo);
      }
      // ... your success handling logic
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error creating group:", error);
      // ... your error handling logic
    } finally {
      setShowConfirmation(false);
      setShowPanel(false); // Close the panel after creation // Hide the confirmation dialog
    }
  };

  const headerTemplate = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <div className="flex align-items-center gap-2">
          {/* You might want to customize the avatar */}
          <Avatar icon="pi pi-users" size="large" shape="circle" />
          <span className="font-bold">Tạo nhóm</span>
        </div>
      </div>
    );
  };

  const footerTemplate = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-end gap-3">
        <Button label="Tạo nhóm" onClick={handleCreateGroup} />
      </div>
    );
  };

  const TABS: OptionType[] = useMemo(
    () => [
      {
        value: "news",
        label: "Bảng tin",
      },
      {
        value: "exercise",
        label: "Công việc",
      },
      {
        value: "member",
        label: "Thành viên",
      },
      {
        value: "point",
        label: "Kết quả",
      },
    ],
    []
  );

  const value: GroupPageContextType = {
    id,
    topic: topicDetail.response?.result,
    jobs: jobDetail.response?.result || [],
    active: activeTab,
  };

  return hasGroup ? (
    <GroupPageContext.Provider value={value}>
      <Loader show={topicDetail.isFetching || jobDetail.isFetching} />
      {/* {typeof groupDetail.data?.result?.countMember === "number" || */}

      {/* {+(groupDetail.data?.result?.countMember || 0) <= 4} */}
      {parseInt(String(groupDetail.data?.result?.countMember || "0"), 10) <=
        4 && (
        <Fragment>
          <Link href={ROUTES.topic.invite}>
            <Button className="p-button p-component p-2">Mời thành viên</Button>
          </Link>
        </Fragment>
      )}
      <div className="flex align-items-center border-bottom-2 border-200 bg-white border-round overflow-hidden">
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
        {activeTab === "news" && <NewsTab />}
        {activeTab === "exercise" && <ExerciseTab />}
        {activeTab === "member" && <MemberTab />}
        {activeTab === "point" && <ResultTab />}
      </div>
    </GroupPageContext.Provider>
  ) : (
    <div className=" gap-3">
      <div className="block">
        <DataTable
          value={studentQuery.data?.result?.responses || []}
          rowHover={true}
          className=" max-w-full w-full"
          // cellClassName={}
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
            header={""}
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
            }}
            field="maSo"
            align={"center"}
            className="center"
            header={"Mã sinh viên"}
          />
        </DataTable>
      </div>
      <div className="block">
        <Link
          href={`${
            ROUTES.topic.group
          }/create?studentId=${maSo}&hasGroup=${!hasGroup}`}
        >
          <Button className="p-button p-component p-2">Xem nhóm</Button>
        </Link>
        <Panel
          headerTemplate={headerTemplate}
          footerTemplate={footerTemplate}
          toggleable
        >
          {selectedRows.length > 0 && (
            <div>
              <h2>Đồng ý tạo nhóm với {selectedRows.length} thành viên</h2>
            </div>
          )}
        </Panel>
      </div>

      <ConfirmDialog // Add the ConfirmDialog component
        visible={showConfirmation}
        onHide={() => setShowConfirmation(false)}
        message={
          selectedRows.length > 0
            ? "Bạn có chắc muốn tạo nhóm?"
            : "Bạn có chắc muốn tạo nhóm với mỗi bạn?"
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
