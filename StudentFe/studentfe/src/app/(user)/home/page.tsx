"use client";

import { ACCESS_TOKEN, ROUTES } from "@/assets/config";
import { cookies, date } from "@/assets/helpers";
import { HTML } from "@/assets/helpers/string";
import { useGetDetail, useGetList } from "@/assets/useHooks/useGet";
import {
  GroupParamType,
  GroupType,
  JobParamType,
  JobType,
  NotificationParamType,
  NotificationType,
} from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { CustomImage, Loader } from "@/resources/components/UI";
import FullCalendar from "@/resources/components/UI/FullCalendar";
import Chart from "@/resources/components/layout/Chart";
import { format, sub } from "date-fns";
import moment from "moment";
import Link from "next/link";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Ripple } from "primereact/ripple";
import { Skeleton } from "primereact/skeleton";
import { classNames } from "primereact/utils";
import _ from "lodash";
import { refreshTokenApi } from "@/assets/config/apiRequests/StudentApiMutation";

const HomePage = ({ params: { _ } }: PageProps) => {
  const groupQuery = useGetDetail<GroupType, GroupParamType>({
    module: "group",
    params: {
      isGetGroupMeCurrent: true,
      isGetMember: true,
      isGetThesis: true,
    },
  });

  const jobQuery = useGetList<JobType, JobParamType>({
    module: "job",
    enabled: !!groupQuery.response?.result?.thesisDto?.id,
    params: {
      filters: `lastModifiedDate>=${sub(date.CURR_DATE, { days: 7 })}`,
      thesisId: groupQuery.response?.result?.thesisDto?.id,
    },
  });

  const notificationQuery = useGetList<NotificationType, NotificationParamType>(
    {
      module: "notification",
      params: {
        filters: `lastModifiedDate>=${sub(date.CURR_DATE, { days: 7 })}`,
      },
    }
  );

  const ExerciseItemHeader = (
    options: PanelHeaderTemplateOptions,
    job: JobType
  ) => {
    return (
      <div
        className={classNames(
          "flex align-items-center justify-content-between gap-3 p-3 cursor-pointer bg-white border-bottom-1 border-300 border-round-top p-ripple",
          {
            "border-round-bottom": options.collapsed,
          }
        )}
        onClick={options.onTogglerClick}
      >
        <div className="flex align-items-center gap-3">
          <Button icon="pi pi-book" rounded={true} className="w-2rem h-2rem" />

          <p className="font-semibold text-sm text-900">{job.name}</p>
        </div>

        <p className="text-sm text-700">
          Đến hạn vào {moment(job.due).format("DD MMM")}
        </p>

        <Ripple />
      </div>
    );
  };
  const buttonClick = async () => {
    const refreshResponse = await refreshTokenApi();

    await cookies.set(ACCESS_TOKEN, refreshResponse?.result?.accessToken);

    console.log(cookies.get(ACCESS_TOKEN) + "2");
  };

  return (
    <div className="flex gap-3">
      <Loader
        show={
          // groupQuery.isFetching ||
          // jobQuery.isFetching ||
          notificationQuery.isFetching
        }
      />

      <div className="flex-1">
        <div className="flex align-items-center justify-content-between">
          <div className="col-6">
            {/* <span className='p-input-icon-left'>
                            <i className='pi pi-search' />
                            <InputText placeholder={t('common:search')} className='border-round-3xl w-20rem' />
                        </span> */}
          </div>

          <div className="col-6 flex justify-content-end">
            <AvatarGroup>
              {groupQuery.response?.result?.members?.map((member) => (
                <Avatar
                  key={member.student?.id}
                  label={member.student?.name?.[0]}
                  className="border-circle w-3rem h-3rem"
                />
              ))}

              <Link href={ROUTES.topic.invite}>
                <Button label="Thêm thành viên" size="small" rounded={true} />
              </Link>
            </AvatarGroup>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex-1">
            <Card title="Sắp đến hạn" subTitle="Danh sách bài tập đến hạn">
              {jobQuery.isFetching ? (
                <div className="flex flex-column gap-3">
                  <div className="flex gap-3 align-items-center shadow-1 border-1 border-300 border-round overflow-hidden p-3">
                    <Skeleton width="2rem" height="2rem" shape="circle" />

                    <div className="flex-1">
                      <Skeleton className="h-2rem w-15rem" />
                    </div>

                    <Skeleton className="w-8rem h-2rem" />
                  </div>
                  <div className="flex gap-3 align-items-center shadow-1 border-1 border-300 border-round overflow-hidden p-3">
                    <Skeleton width="2rem" height="2rem" shape="circle" />

                    <div className="flex-1">
                      <Skeleton className="h-2rem w-15rem" />
                    </div>

                    <Skeleton className="w-8rem h-2rem" />
                  </div>
                  <div className="flex gap-3 align-items-center shadow-1 border-1 border-300 border-round overflow-hidden p-3">
                    <Skeleton width="2rem" height="2rem" shape="circle" />

                    <div className="flex-1">
                      <Skeleton className="h-2rem w-15rem" />
                    </div>

                    <Skeleton className="w-8rem h-2rem" />
                  </div>
                </div>
              ) : (
                <div className=" overflow-auto" style={{ maxHeight: 230 }}>
                  <div className="flex flex-column gap-3">
                    {jobQuery?.response?.result?.map((job) => (
                      <Panel
                        key={job.id}
                        headerTemplate={(options) =>
                          ExerciseItemHeader(options, job)
                        }
                        toggleable={true}
                        collapsed={true}
                        className="shadow-1 border-1 border-300 border-round overflow-hidden"
                      >
                        <div className="p-3 pb-4">
                          <div className="flex align-items-center justify-content-between pb-3">
                            <p className="text-sm text-500 font-semibold">
                              Đã đăng vào{" "}
                              {moment(job.lastModifiedDate).format("DD MMM")}
                            </p>

                            {/* <p className='text-sm text-500 font-semibold'>Đã nộp</p> */}
                          </div>

                          <div
                            dangerouslySetInnerHTML={HTML(
                              job.instructions || ""
                            )}
                          />
                        </div>

                        <div className="flex align-items-center justify-content-between gap-3 cursor-pointer bg-white border-top-1 border-300 p-3">
                          <Link
                            href={`${ROUTES.topic.job_detail}/${job.id}?topicId=${groupQuery.response?.result?.thesisDto?.id}&groupId=${groupQuery.response?.result?.id}`}
                            className="p-ripple hover:bg-blue-50 hover:underline border-round"
                          >
                            <p className="text-blue-600 font-semibold">
                              Xem hướng dẫn
                            </p>
                            <Ripple />
                          </Link>
                        </div>
                      </Panel>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <Card title="Kết quả" className="h-full flex-1">
            <div className="flex align-items-center flex-wrap pb-3">
              <div className="flex align-items-center col-6 gap-2">
                <Skeleton height="1rem" width="2rem" className="bg-green-500" />
                <p>Điểm giảng viên hướng dẫn</p>
              </div>
              <div className="flex align-items-center col-6 gap-2">
                <Skeleton height="1rem" width="2rem" className="bg-blue-500" />
                <p>Điểm giảng viên phản biện</p>
              </div>
              <div className="flex align-items-center col-6 gap-2">
                <Skeleton
                  height="1rem"
                  width="2rem"
                  className="bg-bluegray-800"
                />
                <p>Điểm giảng viên phản biện</p>
              </div>
            </div>

            <Chart />
          </Card>
        </div>
      </div>

      <div style={{ width: 400 }}>
        <Card
          title="Thông báo"
          subTitle="Thông báo mới từ khoa"
          className="mb-3"
        >
          {notificationQuery.isFetching ? (
            <div className="flex flex-column gap-3">
              <div className="flex gap-3 mb-4">
                <Skeleton width="6rem" height="4rem" />
                <div className="flex-1">
                  <Skeleton className="mb-2" />
                  <Skeleton className="mb-2" />
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <Skeleton width="6rem" height="4rem" />
                <div className="flex-1">
                  <Skeleton className="mb-2" />
                  <Skeleton className="mb-2" />
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <Skeleton width="6rem" height="4rem" />
                <div className="flex-1">
                  <Skeleton className="mb-2" />
                  <Skeleton className="mb-2" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-column gap-3">
              {notificationQuery.response?.result?.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 cursor-pointer"
                >
                  <CustomImage
                    src={notification.image?.path}
                    alt="hi"
                    width="100"
                    imageClassName="shadow-3 border-round"
                  />

                  <div className="flex flex-column justify-content-between flex-1">
                    <Link
                      href={`${ROUTES.information.notification}/${notification.id}`}
                      className="text-900 font-semibold no-underline hover:text-primary"
                    >
                      {notification.name}
                    </Link>

                    <p className="text-right text-xs">
                      {moment(notification.lastModifiedDate).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <FullCalendar />
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
