"use client";

import { API, ACCESS_TOKEN, DATA_RESULT } from "@/assets/config";
import { http } from "@/assets/helpers";
import { HTML } from "@/assets/helpers/string";
import {
  AuthType,
  ExchangeParamType,
  ExchangeType,
  JobParamType,
  JobResultParamType,
  JobResultType,
  JobType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { FileType } from "@/assets/types/form";
import { ResponseType } from "@/assets/types/httpRequest";
import { Loader } from "@/resources/components/UI";
import { InputFile } from "@/resources/components/form/inputFile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import moment from "moment";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import { Skeleton } from "primereact/skeleton";
import { createContext, useContext, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { useGetDetail, useGetList } from "@/assets/useHooks/useGet";
import { toast } from "react-toastify";
import useCookies from "@/assets/useHooks/useCookies";
import { JobInfo, ExerciseJob, CommentJob } from "../_job";
import { UserProvider, useUser } from "@/assets/context/UserContext";
import dynamic from "next/dynamic";
import { useUserStore } from "@/assets/zustand/user";
import { GroupPageContext } from "../../[id]/page";

interface JobPageContextType {
  groupId: number;
  job?: JobType | null;
  comments?: ExchangeType[];
  exercise?: FileType[];
}

const JobPageContext = createContext<JobPageContextType>({
  groupId: 0,
  job: null,
  comments: [],
  exercise: [],
});
const LazyComponentNoSSR = dynamic(() => import("../_job/Comment"), {
  loading: () => <p>Đang tải...</p>, // Hiển thị nội dung loading khi component chưa sẵn sàng
  ssr: false, // Không sử dụng SSR, chỉ load trên client-side
});

const JobPage = ({ params, searchParams }: PageProps) => {
  const { id } = params;
  const { topicId, groupId } = searchParams;
  const { user } = useUserStore();
  const { groupDetail } = useContext(GroupPageContext);
  console.log(groupDetail);

  const jobDetail = useGetDetail<JobType, JobParamType>({
    module: "job",
    params: {
      groupId: groupDetail?.id,
    },
  });

  const exchangeQuery = useGetList<ExchangeType, ExchangeParamType>({
    module: "exchange",
    params: {
      removeFacultyId: true,
      jobId: id,
    },
  });

  const exerciseQuery = useGetList<JobResultType, JobResultParamType>({
    module: "job_result",
    enabled: !!user?.id,
    params: {
      removeFacultyId: true,
      jobId: id,
      studentId: user?.id!,
    },
  });

  const jobResultMutation = useMutation<
    any,
    AxiosError<ResponseType>,
    { files: string[] }
  >({
    mutationFn: async (data) => {
      return http.post(API.list.job_result, {
        files: data.files,
        jobId: id,
      });
    },
  });

  const exchangeMutation = useMutation({
    mutationFn: (content: string) => {
      return http.post(API.list.exchange, {
        content,
        jobId: id,
      });
    },
    onSuccess: () => {
      exchangeQuery.refetch();
    },
  });

  const Placeholder = () => {
    return (
      <>
        <Skeleton height="3rem" className="w-full" />

        <div className="flex align-items-center justify-content-between my-3">
          <Skeleton height="1rem" width="15rem" />

          <Skeleton height="1rem" width="15rem" />
        </div>

        <Skeleton height="4rem" className="w-full" />
      </>
    );
  };

  const jobPageValue: JobPageContextType = {
    groupId,
    job: jobDetail.response?.result,
    comments: exchangeQuery.response?.result || [],
    exercise: exerciseQuery.response?.result?.[0]?.files || [],
  };
  console.log(jobDetail.response?.result);

  return (
    <JobPageContext.Provider value={jobPageValue}>
      <div className="flex pr-2 gap-3">
        <Loader
          show={
            jobDetail.isFetching ||
            exchangeQuery.isFetching ||
            exerciseQuery.isFetching ||
            exchangeMutation.isPending ||
            jobResultMutation.isPending
          }
        />

        <div className="flex-1">
          <div className="flex gap-3 bg-white p-4 border-round shadow-1">
            <Button
              icon="pi pi-book"
              rounded={true}
              className="w-3rem h-3rem"
            />

            <div className="flex-1 flex flex-column">
              <div>{jobDetail.isFetching ? <Placeholder /> : <JobInfo />}</div>

              <Divider />

              <InputFile
                id="form_data_files"
                value={jobDetail?.response?.result?.files || []}
                multiple={true}
                disabled={true}
                hasDefault={false}
                fileClassName="col-6"
              />

              <Divider />

              <CommentJob
                onSubmit={(content) => {
                  exchangeMutation.mutate(content);
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-25rem">
          <ExerciseJob
            onSubmit={(files) => {
              jobResultMutation.mutate(
                {
                  files,
                },
                {
                  onSuccess: () => {
                    toast.success("Nộp bài thành công");
                  },
                }
              );
            }}
          />
        </div>
      </div>
      {/* <LazyComponentNoSSR onSubmit={()=>console.log(123)} /> */}
    </JobPageContext.Provider>
  );
};

export default JobPage;
export { JobPageContext };
