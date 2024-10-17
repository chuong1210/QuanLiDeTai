"use client";

import { ROUTES, ROWS_PER_PAGE } from "@/assets/config";
import { DATE_FILTER } from "@/assets/config/info";
import { cookies, http } from "@/assets/helpers";
import {
  useGetDetail,
  useGetList,
  useGetListWithPagination,
} from "@/assets//useHooks/useGet";
import {
  AuthType,
  GroupParamType,
  GroupType,
  StudentParamType,
  StudentType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { MetaType } from "@/assets/types/httpRequest";
import { DEFAULT_META, DEFAULT_PARAMS } from "@/assets/config/httpRequest";
import { Loader } from "@/resources/components/UI";
import { Dropdown } from "@/resources/components/form/Dropdown";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Fragment, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { AvatarGroup } from "primereact/avatargroup";
import { Avatar } from "primereact/avatar";
import SearchForm from "../invite/_invite/searchForm";
import { useUserStore } from "@/assets/zustand/user";

const GroupPage = ({ params: { lng } }: PageProps) => {
  const [meta, setMeta] = useState<MetaType>(DEFAULT_META);
  const [params, setParams] = useState<GroupParamType>(DEFAULT_PARAMS);
  const [currentPage, setCurrentPage] = useState(meta.currentPage);
  const [filter, setFilter] = useState<string | null>(null);

  const { limit, page, orderBy, orderDirection } = params;
  // const [hasGroup, setHasGroup] = useState<boolean>(false);

  let hasGroup: boolean = false;
  const { user } = useUserStore();

  const idStudent: string = user?.student?.id?.toString() ?? "";
  const studentQuery = useGetDetail<StudentType, StudentParamType>({
    module: "student",
    // params: { maSo: idStudent },
    enabled: !!user,
    // _onSuccess: (data) => {
    //   if (data.result?.groupDto?.id) {
    //     setHasGroup(true);
    //   }
    // },
  });
  const groupQuery = useGetListWithPagination<GroupType>({
    module: "group",
    params: {
      ...params,
      page: currentPage,
      limit: limit,
      orderBy: orderBy,
      orderDirection: orderDirection,
    },
    _onSuccess: (data) => {
      data.result;
    },
  });
  const Groups: GroupType[] = groupQuery.data?.result?.responses;

  //vì trong studen đã có group attribute nên thay bằng cái này
  const groupQueryDetail = useGetDetail<GroupType>({
    module: "group",
  });
  // hasGroup = (Groups ?? []).some((group) =>
  //   group.students?.some((stu) => stu.id?.toString() === idStudent)
  // );

  hasGroup = !!groupQueryDetail.data?.result;

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setParams((prev) => ({
      ...prev,
      pageSize: e.rows,
      currentPage: e.first + 1,
    }));
  };

  const renderActions = (data: GroupType) => {
    return (
      <div className="flex align-items-center justify-content-center">
        <Link href={`${ROUTES.topic.group}/${data.id}`}>
          <i className="pi pi-pencil hover:text-primary cursor-pointer" />
        </Link>
      </div>
    );
  };
  const statusBodyTemplate = (rowData: GroupType) => {
    const hasMembers = (rowData.students?.length ?? 0) > 0;
    const statusColor = hasMembers ? "success" : "danger"; // Màu xanh nếu có thành viên, màu đỏ nếu không có

    return (
      <Tag
        value={hasMembers ? "Có thành viên" : "Không có thành viên"}
        severity={statusColor}
      />
    );
  };

  const renderUsers = (rowData: GroupType) => {
    const studentCount = rowData.students?.length ?? 0; // Sử dụng optional chaining và nullish coalescing để đảm bảo không có lỗi
    return (
      <AvatarGroup className="center">
        {Array.from({ length: studentCount }).map((_, index) => (
          <Avatar key={index} icon="pi pi-user" className="mr-2" />
        ))}
        <Avatar label={`+${studentCount}`} />
      </AvatarGroup>
    );
  };
  const handleFilter = (status: string | null) => {
    setFilter(status);
  };
  return (
    <>
      {/* studentQuery.data?.result?.groupDto?.id */}
      {!hasGroup ? (
        <div className="flex flex-column gap-4">
          <div className="flex align-items-center justify-content-between bg-white p-3 border-round-lg shadow-3">
            <p className="text-xl font-semibold">Danh sách nhóm</p>
            {!hasGroup && (
              <Fragment>
                <div className="flex">
                  {" "}
                  <p>Chưa có nhóm?</p>
                  <Link
                    href={`${ROUTES.topic.group}/create?studentId=${studentQuery.data?.result?.id}&hasGroup=${hasGroup}`}
                  >
                    <i className="m-2 underline text-bluegray-700 ">Tạo nhóm</i>
                  </Link>
                </div>
                <Link href={ROUTES.topic.group}>
                  <i className="m-2 underline text-bluegray-700  ">
                    Tham gia nhóm
                  </i>
                </Link>
              </Fragment>
            )}
          </div>

          <div className="flex align-items-center justify-content-between">
            <SearchForm
              placeholder={`${"search"}...`}
              id="searchForm"
              blockClassName="w-20rem center flex  "
            />
          </div>

          <div className="border-round-xl overflow-hidden relative shadow-5">
            <Loader show={groupQuery.isFetching} />

            {/* <div className="flex align-content-center justify-content-center  gap-2 m-4">
              <Button
                className={`p-button ${
                  filter === null ? "p-button-primary" : ""
                }`}
                onClick={() => handleFilter(null)}
                severity="success"
                outlined
              >
                Xem tất cả nhóm
              </Button>
              <Button
                className={`p-button ${
                  filter === "hasMembers" ? "p-button-primary" : ""
                }`}
                onClick={() => handleFilter("hasMembers")}
                severity="info"
                outlined
              >
                Xem nhóm chưa đủ người
              </Button>
              <Button
                className={`p-button ${
                  filter === "noMembers" ? "p-button-primary" : ""
                }`}
                onClick={() => handleFilter("noMembers")}
                severity="danger"
                outlined
              >
                Xem nhóm không có người
              </Button>
            </div> */}

            <DataTable
              showGridlines
              value={
                groupQuery.data?.result?.responses.filter(
                  (group: GroupType) => {
                    if (filter === null) return true;
                    if (filter === "hasMembers") {
                      return (group.students?.length ?? 0) > 0; // Lọc những nhóm có thành viên
                    } else if (filter === "noMembers") {
                      return (group.students?.length ?? 0) === 0; // Lọc những nhóm không có thành viên
                    }
                    return true;
                  }
                ) || []
              }
              className="p-datatable-sm"
              style={{ padding: "10px" }}
            >
              <Column
                alignHeader="center"
                header={"Thao tác"}
                body={renderActions}
                bodyStyle={{
                  padding: " 10px 16px" /* Adjust as necessary */,
                  textAlign: "center" /* Centers the text */,
                  verticalAlign: "middle" /* Vertically centers the text */,
                }}
                headerStyle={{
                  // borderRight: "1px solid #d8d8d8",
                  background: "var(--primary-color)",
                  color: "var(--surface-a)",
                  margin: "0px",
                }}
                // bodyStyle={{ borderRight: "1px solid #d8d8d8" }}
              />
              <Column
                header="Tình trạng"
                alignHeader="center"
                headerStyle={{
                  background: "var(--primary-color)",
                  color: "var(--surface-a)",
                }}
                body={statusBodyTemplate}
                style={{ textAlign: "center" }}
              />
              <Column
                alignHeader="center"
                headerStyle={{
                  background: "var(--primary-color)",
                  color: "var(--surface-a)",
                }}
                field="id"
                header="Mã nhóm"
                style={{ textAlign: "center" }}
              />
              <Column
                alignHeader="center"
                headerStyle={{
                  borderRight: "1px solid #d8d8d8",
                  background: "var(--primary-color)",
                  color: "var(--surface-a)",
                }}
                field="students"
                header="Số lượng người trong group"
                body={renderUsers}
                style={{ textAlign: "center" }}
                bodyStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </DataTable>

            <div className="flex align-items-center justify-content-between bg-white px-3 py-2">
              <Dropdown
                id="date_created_filter"
                value="date_decrease"
                optionValue="code"
                onChange={(sortCode) => {
                  const filter = DATE_FILTER().find((t) => t.code === sortCode); //@chuongvo1012 DATE_FILTER
                  setParams((prev) => {
                    return {
                      ...prev,
                      sorts: http.handleSort(filter, prev),
                      //http://localhost:8888/groups?page=1&pageSize=10&sorts=-DateCreated&isGetGroupMe=true
                    };
                  });
                }}
                options={DATE_FILTER()}
              />

              <Paginator
                first={http.currentPage(meta.currentPage)}
                rows={meta.pageSize}
                totalRecords={meta.totalCount}
                rowsPerPageOptions={ROWS_PER_PAGE}
                onPageChange={onPageChange}
                className="border-noround p-0"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="center font-bold text-center flex justify-content-center">
            Bạn đã có nhóm
          </p>

          <Link
            className="m-3"
            href={`${ROUTES.topic.group}/${groupQueryDetail.data?.result?.id}?hasGroup=${hasGroup}`}
          >
            <Button
              className="p-button p-component w-full p-2 border-200 border-solid"
              severity="success"
              style={{
                display: "inline-block",
                textAlign: "center",
                lineHeight: "1.5",
                verticalAlign: "middle",
                borderColor: "#14ce1433",
              }}
              rounded
              outlined
            >
              Xem nhóm
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default GroupPage;
