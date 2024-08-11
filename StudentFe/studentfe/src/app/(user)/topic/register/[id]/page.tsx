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
import { Dialog } from "primereact/dialog";
import {
  cancelTopicAPI,
  registerTopicAPI,
} from "@/assets/config/apiRequests/StudentApiMutation";
import { ResponseType } from "@/assets/types/httpRequest";
import { useRegisterTopic } from "@/assets/useHooks/useNotificationModal";
import { NotificationCard } from "@/resources/components/modal";
import { useState } from "react";
import { Tooltip } from "primereact/tooltip";
interface TopicDetailModalProps extends PageProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  topic: TopicType;
}
const TopicDetailPage = ({
  params: _params,
  visible,
  setVisible,
  topic,
}: TopicDetailModalProps) => {
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  let isSelectedTopic: boolean = false;
  // Lấy dữ liệu từ localStorage
  let storedTopics = []; // Initialize as an empty array

  if (localStorage.getItem("topics")) {
    try {
      storedTopics = JSON.parse(localStorage.getItem("topics") ?? "");
    } catch (error) {
      console.error("Error parsing topics from localStorage:", error);
      // Optionally, clear the invalid data:
      // localStorage.removeItem("topics");
    }
  }

  // ... rest of your code
  const { id } = _params;
  // const isSelectedTopic: boolean = storedTopics.some((t) => t.id === id);
  if (storedTopics === id) {
    console.log(123456);
    isSelectedTopic = true;
  }

  const router = useRouter();
  const { notificationModalRef, onNotification, onShowNotificationModal } =
    useRegisterTopic();
  const { response, isFetching } = useGetDetail<TopicType>({
    module: "topic",
    enabled: id !== "0",
    params: {
      id,
      // isAllDetail: true,
    },
    _onSuccess(_data) {},
  });

  const topicRegister = useMutation<ResponseType, AxiosError, TopicType>({
    mutationFn: (data: TopicType) => {
      const newData: TopicType = { ...data, researchID: data.id };
      return registerTopicAPI(newData);
    },
  });
  const topicCancel = useMutation<ResponseType, AxiosError, TopicType>({
    mutationFn: (data: TopicType) => {
      const newData: TopicType = { ...data, researchID: data.id };
      return cancelTopicAPI(newData);
    },
  });

  return (
    <Dialog
      header="Chi tiết đề tài"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => setVisible(false)}
    >
      <div className="pr-2">
        <NotificationCard ref={notificationModalRef} message={message} />
        {/* <Loader show={isFetching || topicMutation.isPending} /> */}

        {isFetching ? (
          // Hiển thị Skeleton khi đang loading
          <div className="flex flex-column gap-3">
            <Skeleton height="3rem" width="100%" />
            <Skeleton height="10rem" width="100%" />
            <Skeleton height="3rem" width="100%" />
          </div>
        ) : (
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
                    {response?.result?.teachers?.length}
                  </p>
                </div>

                <div className="flex align-items-center">
                  <p className="w-15rem">{"Email"}</p>
                  <p className="text-900 font-semibold">
                    {response?.result?.teachers?.map((t) => t.email)}
                  </p>
                </div>

                <div className="flex align-items-center">
                  <p className="w-15rem">{"Phone number"}</p>
                  <p className="text-900 font-semibold">
                    {response?.result?.teachers?.map((t) => t.phoneNumber)}
                  </p>
                </div>

                <div className="flex align-items-center">
                  <p className="w-15rem">{"Học thuật giáo viên"}</p>
                  <p className="text-900 font-semibold">
                    {response?.result?.teachers?.map((t) => t.academicTitle)}
                  </p>
                </div>
              </div>
            </Panel>

            {response?.result?.teachers &&
              response?.result?.teachers.length > 0 && (
                <Panel
                  toggleable={true}
                  collapsed={true}
                  header="Giảng viên hướng dẫn"
                  className="shadow-2 border-1 border-300 border-round-xl overflow-hidden"
                >
                  <div className="p-3">
                    {response?.result?.teachers?.map((teacher, index) => (
                      <>
                        <div
                          className="flex flex-column gap-3"
                          key={teacher.id}
                        >
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
                            <p className="w-15rem">
                              {"Học thuật của giáo viên"}
                            </p>
                            <p className="text-900 font-semibold">
                              {teacher?.academicTitle}
                            </p>
                          </div>
                        </div>

                        {index < response.result?.teachers?.length! - 1 && (
                          <div className="px-8">
                            <Divider />
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </Panel>
              )}

            {response?.result?.teachers &&
              response.result?.teachers?.length > 0 && (
                <Panel
                  toggleable={true}
                  collapsed={true}
                  header="Giảng viên phản biện"
                  className="shadow-2 border-1 border-300 border-round-xl overflow-hidden"
                >
                  <div className="p-3">
                    {response?.result?.teachers?.map((teacher, index) => (
                      <>
                        <div
                          className="flex flex-column gap-3"
                          key={teacher.id}
                        >
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
                            <p className="w-15rem">
                              {"Học thuật của giáo viên"}
                            </p>
                            <p className="text-900 font-semibold">
                              {teacher?.academicTitle}
                            </p>
                          </div>
                        </div>

                        {index < response.result?.teachers?.length! - 1 && (
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
                    {response?.result?.name}
                  </p>
                )}

                {storedTopics === id ? (
                  <>
                    <Tooltip target=".cancle" mouseTrack mouseTrackLeft={10} />
                    <Button
                      tooltipOptions={{ showDelay: 1000, hideDelay: 300 }}
                      label="Hủy đăng ký"
                      className="cancle"
                      size="small"
                      loading={topicCancel.isPending}
                      onClick={() => {
                        topicCancel.mutate(topic, {
                          onSuccess: (data) => {
                            setMessage(data.message ?? "");
                            topic.isRegister = false;

                            // localStorage.removeItem("topics");
                            // setVisible(false);
                            onNotification();

                            localStorage.setItem("topics", JSON.stringify(0));
                          },
                        });
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Tooltip
                      target=".register"
                      mouseTrack
                      mouseTrackLeft={10}
                    />
                    <Button
                      tooltipOptions={{ showDelay: 1000, hideDelay: 300 }}
                      label="Đăng ký"
                      className="register"
                      size="small"
                      loading={topicRegister.isPending}
                      onClick={() => {
                        topicRegister.mutate(topic, {
                          onSuccess: (data) => {
                            setMessage(data.message ?? "");

                            // notificationModalRef.current?.showModal();
                            onNotification();
                            // router.push(
                            //   `${ROUTES.topic.register_topic}?activeItem=register_topic&openMenu=false&parent=thesis`
                            // );
                            // Lưu dữ liệu vào localStorage
                            topic.isRegister = true;
                            localStorage.setItem(
                              "topics",
                              JSON.stringify(topic.id)
                            );
                          },
                        });
                      }}
                    />
                  </>
                )}
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
                <p dangerouslySetInnerHTML={HTML(response?.result?.notes)} />
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
                  {response?.result?.subjects?.map((t) => t.name).join(", ")},
                  yêu cầu tối thiểu {response?.result?.minMembers} thành viên và
                  tối đa {response?.result?.maxMembers} thành viên tham gia thực
                  hiện, được hướng dẫn bởi{" "}
                  {response?.result?.teachers
                    ?.map((t) => t.academicTitle + " " + t.name)
                    .join(", ")}{" "}
                  với nhiều năm kinh nghiệm giảng dạy và nghiên cứu.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default TopicDetailPage;
