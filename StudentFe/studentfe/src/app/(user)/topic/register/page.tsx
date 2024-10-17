"use client";

import {
  API,
  ChangeRegistrationOptions,
  DEFAULT_META,
  DEFAULT_PARAMS,
  ROUTES,
  ROWS_PER_PAGE,
} from "@/assets/config";
import { http } from "@/assets/helpers";
import { HTML } from "@/assets/helpers/string";
import {
  useGetDetail,
  useGetList,
  useGetListWithPagination,
} from "@/assets/useHooks/useGet";
import {
  ChangeRegistration,
  MajorType,
  TeacherParamType,
  TeacherType,
  TopicParamType,
  TopicType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { Loader } from "@/resources/components/UI";
import { Dropdown } from "@/resources/components/form/Dropdown";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Panel } from "primereact/panel";
import { Skeleton } from "primereact/skeleton";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import { OptionType } from "@/assets/types/common";
import {
  fetchAllCourses,
  fetchTopicCourses,
} from "@/assets/config/apiRequests/StudentApiMutation";
import { FileUpload } from "primereact/fileupload";
import File from "@/resources/components/form/File";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { NotificationCard } from "@/resources/components/modal";
import { NotificationCardModalRefType } from "@/assets/types/modal";
import { useRouter } from "next/navigation";
import { useRegisterTopic } from "@/assets/useHooks/useNotificationModal";
import { debug } from "console";
import TopicDetailPage from "./[id]/page";
import { MetaResponseType, MetaType } from "@/assets/types/httpRequest";
import page from "../page";
import { FacultyDutyType } from "@/assets/interface/FacultyDuty";
import { FacultyType } from "@/assets/interface/Faculty";
import SearchForm from "../invite/_invite/searchForm";

const RegisterTopicPage = ({ params: { i } }: PageProps) => {
  const router = useRouter();

  const teacherQuery = useGetList<TeacherType, TeacherParamType>({
    module: "teacher",
  });
  const facultyQuery = useGetList<FacultyType>({
    module: "faculty",
  });

  const [params, setParams] = useState<TopicParamType>(DEFAULT_PARAMS);
  const [selectedTopic, setSelectedTopic] = useState<TopicType>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [meta, setMeta] = useState<MetaType>(DEFAULT_META);
  const { limit, page, orderBy, orderDirection } = params;

  const [currentPage, setCurrentPage] = useState(meta.currentPage);
  const [buttonNumbers, setButtonNumbers] = useState<number[]>([]);

  const totalPage = meta.totalPages;

  const { response, isFetching } = useGetDetail<TopicType>({
    module: "topic",
    enabled: !!selectedTopic?.id,
    params: {
      id: selectedTopic?.id,
      isAllDetail: true,
    },
    _onSuccess(_data) {},
  });

  // const topicMutation = useMutation<any, AxiosError, { thesisId: number }>({
  //   mutationFn: (data: any) => {
  //     return registerTopicAPI(data);
  // return http.post(API.post.research, data);
  //   },
  // });

  const topicQuery = useGetListWithPagination<TopicType, TopicParamType>({
    module: "research",
    params: {
      // trống là để select all
      ...params,
      page: currentPage,
      limit: limit,
      orderBy: orderBy,
      orderDirection: orderDirection,
    },
  });

  const debounceKeyword = useDebouncedCallback((keyword) => {
    setParams((prev) => ({
      ...prev,
      filters: http.handleFilter(
        prev.filters,
        "(internalCode|name)",
        "@=",
        keyword
      ),
    }));
  }, 600);

  const viewTopic = (data: TopicType) => {
    return (
      <div className="flex justify-content-center gap-3">
        <i
          className="pi pi-eye cursor-pointer hover:text-primary"
          title="Xem chi tiết"
          onClick={() => {
            setSelectedTopic(data);
            setIsModalVisible(true);
            // router.push(
            //   `${ROUTES.topic.register_topic}/${selectedTopic?.maDeTai}`
            // );
          }}
        />
      </div>
    );
  };

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setParams((prev) => ({
      ...prev,
      pageSize: e.rows,
      currentPage: e.first + 1,
    }));
  };
  const convertChangeRegistrationToOptions = (
    changeRegistration: ChangeRegistration
  ): OptionType[] => {
    return Object.entries(changeRegistration).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  };
  const facultyNameValues: FacultyType[] = facultyQuery.data?.result ?? [];

  const optionsFaculty: OptionType[] = facultyNameValues.map((faculty) => ({
    label: faculty.name,
    value: faculty.id,
  }));

  const options = convertChangeRegistrationToOptions(ChangeRegistrationOptions);
  const [topic, setTopic] = useState<string>(options[0]?.name ?? "");

  // const mandatoryTemplate = (rowData: TopicType) => {
  //   return <Checkbox checked={rowData.status === "A"} disabled />;
  // };

  // const prerequisiteTemplate = (rowData: TopicType) => {
  //   return (
  //     <span style={{ color: rowData.status === "AR" ? "red" : "black" }}>
  //       {rowData.isRegister}
  //     </span>
  //   );
  // };

  return (
    <div className="flex flex-column gap-4 p-4">
      <div className="flex align-items-center justify-content-between bg-white h-4rem px-3 border-round-lg shadow-3">
        <p className="text-xl font-semibold">Danh sách đề tài</p>
      </div>
      <div className="flex align-items-center gap-3 mb-2">
        <SearchForm
          id=""
          placeholder="Search..."
          blockClassName="w-20rem"
          onChange={(e) => debounceKeyword(e.target.value)}
        />
        <Dropdown
          placeholder="Chọn đề tài"
          id="noti_type"
          row={true}
          label="Chọn đề tài"
          value={topic}
          checkmark={true}
          className="w-full md:w-14rem"
          options={optionsFaculty}
          onChange={(e) => {
            setTopic(e);
          }}
        />
      </div>
      <div className="border-round-xl overflow-hidden relative shadow-2 mt-0">
        {<Loader show={topicQuery.isFetching && teacherQuery.isFetching} />}
        <DataTable
          value={topicQuery.data?.result?.responses || []}
          rowHover={true}
          stripedRows={true}
          showGridlines={true}
          emptyMessage="Danh sách hiện trống"
        >
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            header={
              <i className="pi pi-user-edit" style={{ fontSize: "1.5rem" }}></i>
            }
            body={viewTopic}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            field="internalCode"
            header="Mã đề tài"
            body={(data: TopicType) => (
              <div className="text-center">{data.id}</div>
            )}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            field="name"
            header="Tên đề tài"
            body={(data: TopicType) => (
              <div className="text-center">{data.name}</div>
            )}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            header="Số lượng sinh viên"
            body={(data: TopicType) => (
              <p className="text-center">
                {data.minMembers} - {data.maxMembers}
              </p>
            )}
          />
          <Column
            alignHeader="center"
            headerStyle={{
              background: "var(--primary-color)",
              color: "var(--surface-a)",
              whiteSpace: "nowrap",
            }}
            header="Chuyên ngành phù hợp"
            body={(data: TopicType) => (
              <div className="text-center">
                {data.subjects?.map((t) => t.name).join(", ")}
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
            header="Ghi chú"
            body={(data: TopicType) => (
              <div className="text-center">{data?.code}</div>
            )}
          />
        </DataTable>
        <div className="flex align-items-center justify-content-between bg-white px-3 py-2">
          <Paginator
            rows={topicQuery.data?.result?.totalElements}
            totalRecords={topicQuery.data?.result?.totalPages}
            rowsPerPageOptions={ROWS_PER_PAGE}
            onPageChange={onPageChange}
            className="border-noround p-0"
          />
        </div>
      </div>
      {selectedTopic && (
        <div className="bg-white border-round-xl p-3 overflow-hidden shadow-2 relative">
          <TopicDetailPage
            visible={isModalVisible}
            setVisible={setIsModalVisible}
            params={{ id: selectedTopic?.id?.toString() }}
            topic={selectedTopic}
          />
        </div>
      )}
    </div>
  );
};

export default RegisterTopicPage;
