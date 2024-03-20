"use client";

import { API, ROUTES } from "@/assets/config";
import { http } from "@/assets/helpers";
import { HTML } from "@/assets/helpers/string";
import { useGetDetail } from "@/assets/useHooks/useGet";
import { TopicType } from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { Loader } from "@/resources/components/UI";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { Skeleton } from "primereact/skeleton";
import { toast } from "react-toastify";

const TopicDetailPage = ({ params: _params }: PageProps) => {
  const { id } = _params;
  const router = useRouter();

  const { response, isFetching } = useGetDetail<TopicType>({
    module: "topic",
    enabled: id !== "0",
    params: {
      id,
      isAllDetail: true,
    },
    _onSuccess(_data) {},
  });

  const topicMutation = useMutation<any, AxiosError, { thesisId: number }>({
    mutationFn: (data) => {
      return http.post(API.post.register_topic, data);
    },
  });

  return (
    <div className="pr-2">
      <Loader show={isFetching || topicMutation.isPending} />

      <div className="flex flex-column gap-3">
        <Panel
          toggleable={true}
          collapsed={true}
          header={"thesis lecture"}
          className="shadow-2 border-1 border-300 border-round-xl overflow-hidden"
        >
          <div className="flex flex-column gap-3 p-3">
            <div className="flex align-items-center">
              <p className="w-15rem">{"Giáo viên"}</p>
              <p className="text-900 font-semibold">
                {response?.data?.lecturerThesis?.name}
              </p>
            </div>

            <div className="flex align-items-center">
              <p className="w-15rem">{"Email"}</p>
              <p className="text-900 font-semibold">
                {response?.data?.lecturerThesis?.email}
              </p>
            </div>

            <div className="flex align-items-center">
              <p className="w-15rem">{"Phone number"}</p>
              <p className="text-900 font-semibold">
                {response?.data?.lecturerThesis?.phoneNumber}
              </p>
            </div>

            <div className="flex align-items-center">
              <p className="w-15rem">{"Học thuật giáo viên"}</p>
              <p className="text-900 font-semibold">
                {response?.data?.lecturerThesis?.academicTitle}
              </p>
            </div>
          </div>
        </Panel>

        {response?.data?.thesisInstructions &&
          response?.data?.thesisInstructions.length > 0 && (
            <Panel
              toggleable={true}
              collapsed={true}
              header="Giảng viên hướng dẫn"
              className="shadow-2 border-1 border-300 border-round-xl overflow-hidden"
            >
              <div className="p-3">
                {response?.data?.thesisInstructions?.map((teacher, index) => (
                  <>
                    <div className="flex flex-column gap-3" key={teacher.id}>
                      <div className="flex align-items-center">
                        <p className="w-15rem">{"Tên giáo viên"}</p>
                        <p className="text-900 font-semibold">
                          {teacher?.name}
                        </p>
                      </div>

                      <div className="flex align-items-center">
                        <p className="w-15rem">{"Email"}</p>
                        <p className="text-900 font-semibold">
                          {teacher?.email}
                        </p>
                      </div>

                      <div className="flex align-items-center">
                        <p className="w-15rem">{"Phone number"}</p>
                        <p className="text-900 font-semibold">
                          {teacher?.phoneNumber}
                        </p>
                      </div>

                      <div className="flex align-items-center">
                        <p className="w-15rem">{"Học thuật của giáo viên"}</p>
                        <p className="text-900 font-semibold">
                          {teacher?.academicTitle}
                        </p>
                      </div>
                    </div>

                    {index < response.data?.thesisInstructions?.length! - 1 && (
                      <div className="px-8">
                        <Divider />
                      </div>
                    )}
                  </>
                ))}
              </div>
            </Panel>
          )}

        {response?.data?.thesisReviews &&
          response.data?.thesisReviews?.length > 0 && (
            <Panel
              toggleable={true}
              collapsed={true}
              header="Giảng viên phản biện"
              className="shadow-2 border-1 border-300 border-round-xl overflow-hidden"
            >
              <div className="p-3">
                {response?.data?.thesisReviews?.map((teacher, index) => (
                  <>
                    <div className="flex flex-column gap-3" key={teacher.id}>
                      <div className="flex align-items-center">
                        <p className="w-15rem">{"Tên giáo viên"}</p>
                        <p className="text-900 font-semibold">
                          {teacher?.name}
                        </p>
                      </div>

                      <div className="flex align-items-center">
                        <p className="w-15rem">{"Email"}</p>
                        <p className="text-900 font-semibold">
                          {teacher?.email}
                        </p>
                      </div>

                      <div className="flex align-items-center">
                        <p className="w-15rem">{"Phone number"}</p>
                        <p className="text-900 font-semibold">
                          {teacher?.phoneNumber}
                        </p>
                      </div>

                      <div className="flex align-items-center">
                        <p className="w-15rem">{"Học thuật của giáo viên"}</p>
                        <p className="text-900 font-semibold">
                          {teacher?.academicTitle}
                        </p>
                      </div>
                    </div>

                    {index < response.data?.thesisReviews?.length! - 1 && (
                      <div className="px-8">
                        <Divider />
                      </div>
                    )}
                  </>
                ))}
              </div>
            </Panel>
          )}

        <div className="p-3 bg-white border-round-xl shadow-2">
          <div className="flex align-items-center justify-content-between gap-3">
            {isFetching ? (
              <Skeleton className="flex-1 h-2rem" />
            ) : (
              <p className="flex-1 font-bold text-xl text-800">
                {response?.data?.name}
              </p>
            )}

            <Button
              label="Đăng ký"
              size="small"
              onClick={() => {
                topicMutation.mutate(
                  {
                    thesisId: id,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Đăng ký đề tài thành công");

                      router.push(
                        `${ROUTES.topic.register_topic}?activeItem=register_topic&openMenu=false&parent=thesis`
                      );
                    },
                  }
                );
              }}
            />
          </div>

          <Divider align="center">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-comments" />
              <p className="font-semibold">Lời mời đầu</p>
            </div>
          </Divider>

          {isFetching ? (
            <Skeleton className="h-10rem" />
          ) : (
            <p dangerouslySetInnerHTML={HTML(response?.data?.summary)} />
          )}

          <Divider align="center">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-question-circle" />
              <p className="font-semibold">Về đề tài</p>
            </div>
          </Divider>

          {isFetching ? (
            <Skeleton className="h-3rem" />
          ) : (
            <p>
              Đề tài phù hợp với sinh viên thuộc chuyên nghành{" "}
              {response?.data?.thesisMajors?.map((t) => t.name).join(", ")}, yêu
              cầu tối thiểu {response?.data?.minQuantity} thành viên và tối đa{" "}
              {response?.data?.maxQuantity} thành viên tham gia thực hiện, được
              hướng dẫn bởi{" "}
              {response?.data?.thesisInstructions
                ?.map((t) => t.academicTitle + " " + t.name)
                .join(", ")}{" "}
              với nhiều năm kinh nghiệm giảng dạy và nghiên cứu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
