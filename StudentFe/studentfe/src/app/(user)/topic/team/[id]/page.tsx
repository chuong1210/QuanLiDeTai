"use client";

import { useGetDetail, useGetList } from "@/assets/useHooks/useGet";
import {
  GroupType,
  JobParamType,
  JobType,
  TopicType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { OptionType } from "@/assets/types/common";
import { Loader } from "@/resources/components/UI";
import { classNames } from "primereact/utils";
import { createContext, useMemo, useState } from "react";
import { MemberTab, ExerciseTab, NewsTab, ResultTab } from "../_tab";

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
  const [activeTab, setActiveTab] = useState<string>("news");

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
      id: groupDetail.response?.data?.thesisDto?.id,
      isAllDetail: true,
    },
    enabled: !!groupDetail.response?.data?.thesisDto?.id,
  });

  const jobDetail = useGetList<JobType, JobParamType>({
    module: "job",
    params: {
      thesisId: groupDetail.response?.data?.thesisDto?.id,
      isAllDetail: true,
    },
    enabled: !!groupDetail.response?.data?.thesisDto?.id,
  });

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
    topic: topicDetail.response?.data,
    jobs: jobDetail.response?.data || [],
    active: activeTab,
  };

  return (
    <GroupPageContext.Provider value={value}>
      <Loader show={topicDetail.isFetching || jobDetail.isFetching} />

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
  );
};

export default GroupPage;
export { GroupPageContext };
