"use client";

import { ROUTES, ROWS_PER_PAGE } from "@/assets/config";
import { DATE_FILTER } from "@/assets/config/info";
import { cookies, http } from "@/assets/helpers";
import { useGetDetail, useGetList } from "@/assets//useHooks/useGet";
import {
  GroupParamType,
  GroupType,
  StudentParamType,
  StudentType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { MetaType } from "@/assets/types/httpRequest";
import { DEFAULT_META } from "@/assets/config/httpRequest";
import { Loader } from "@/resources/components/UI";
import { Dropdown } from "@/resources/components/form/Dropdown";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useState } from "react";

const GroupPage = ({ params: { lng } }: PageProps) => {
  const [meta, setMeta] = useState<MetaType>(DEFAULT_META);

  const [params, setParams] = useState<GroupParamType>({
    page: meta.currentPage,
    limit: meta.pageSize,
    sorts: "-DateCreated",
    isGetGroupMe: true,
  });
  const studentId = cookies.get("id") + "";

  const studentQuery = useGetDetail<StudentType>({
    module: "student",
    params: { id: studentId },
    enabled: !!studentId,
    // _onSuccess: (data) => {
    //   if (data.data?.id) {
    //     setHasGroup(true);
    //   }
    // },
  });
  const groupQuery = useGetList<GroupType>({
    module: "group",
    params,
    _onSuccess: (data) => {},
  });
  //http://localhost:8888/group?page=1&pageSize=10&sorts=-DateCreated&isGetGroupMe=true

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

  return (
    <div className="flex flex-column gap-4">
      <div className="flex align-items-center justify-content-between bg-white p-3 border-round-lg shadow-3">
        <p className="text-xl font-semibold">Danh sách nhóm</p>
        {!studentQuery.data?.result?.groupDto?.id && (
          <Link href={`${ROUTES.topic.group}/create`}>
            <button className="p-button p-component">Tạo nhóm</button>
          </Link>
        )}
      </div>

      <div className="flex align-items-center justify-content-between">
        <InputText placeholder={`${"search"}...`} className="w-20rem" />
      </div>

      <div className="border-round-xl overflow-hidden relative shadow-5">
        {/* <Loader show={groupQuery.isFetching} /> */}

        <DataTable value={groupQuery.response?.result || []}>
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
            }}
            header={"Action"}
            body={renderActions}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
            }}
            field="name"
            header="Tên group"
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
            }}
            field="countMember"
            header={"Số lượng người trong group"}
          />
        </DataTable>

        <div className="flex align-items-center justify-content-between bg-white px-3 py-2">
          <Dropdown
            id="date_created_filter"
            value="date_decrease"
            optionValue="code"
            onChange={(sortCode) => {
              //  console.log(JSON.stringify(params) + "before");

              //  console.log(sortCode + "sort"); date_increasesort

              const filter = DATE_FILTER().find((t) => t.code === sortCode); //@chuongvo1012 DATE_FILTER
              //  console.log(filter); object date_filter
              setParams((prev) => {
                return {
                  ...prev,
                  sorts: http.handleSort(filter, prev),
                  //http://localhost:8888/groups?page=1&pageSize=10&sorts=-DateCreated&isGetGroupMe=true
                };
              });
              /// console.log(JSON.stringify(params) + "after");
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
  );
};

export default GroupPage;
