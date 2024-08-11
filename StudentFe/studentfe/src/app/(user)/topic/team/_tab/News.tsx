import { ROUTES } from "@/assets/config";
import GroupBackgroundImg from "/public/images/team/img_group_bg.jpg";
import moment from "moment";
import Link from "next/link";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useContext } from "react";
import { GroupPageContext } from "../[id]/page";

const NewsTab = () => {
  const { topic, jobs, id } = useContext(GroupPageContext);

  return (
    <div>
      <div
        className="border-round-xl flex flex-column justify-content-between p-3"
        style={{
          backgroundImage: `url('${GroupBackgroundImg.src}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: 240,
        }}
      >
        <div className="flex-1"></div>
        <div className="text-white">
          <p className="font-bold text-3xl mb-2">{topic?.groups?.name}</p>
          <p
            className="font-semibold text-xl overflow-hidden"
            style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
          >
            {topic?.name}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <div className="w-16rem">
          <div className="flex flex-column gap-3">
            <div className="shadow-1 border-round p-3 bg-white flex flex-column gap-3 relative z-5">
              <p className="font-semibold">Sắp đến hạn</p>

              <p className="text-500 text-sm">
                Không có công việc nào sắp đến hạn
              </p>

              <div className="flex justify-content-end">
                <p className="text-right font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 px-3 py-2 border-round">
                  {"See All"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-column gap-3">
            <Link
              href={`${ROUTES.topic.job_detail}/0?topicId=${topic?.id}`}
              className="shadow-2 border-round px-4 py-3 bg-white flex align-items-center gap-3 cursor-pointer hover:bg-blue-50 hover:text-primary"
            >
              <Avatar
                icon="pi pi-user"
                className="bg-primary text-white border-circle"
                size="large"
              />
              <p className="font-semibold">Thêm công việc cho nhóm</p>
            </Link>

            <div className="flex flex-column gap-4">
              {jobs &&
                jobs.length > 0 &&
                jobs?.map((job) => (
                  <Link
                    key={job.id}
                    href={`${ROUTES.topic.job_detail}/${job.id}?topicId=${topic?.id}&groupId=${id}`}
                    className="shadow-2 border-round px-4 py-3 bg-white flex align-items-center gap-3 cursor-pointer flex-1 no-underline hover:bg-blue-50"
                  >
                    <Button icon="pi pi-book" rounded={true} />

                    <div className="flex flex-column gap-2">
                      <p className="font-semibold text-sm text-900">
                        {job.teacherBy?.name} đã đăng 1 bài tập mới: {job.name}
                      </p>
                      <p className="text-sm text-700">
                        {moment(job.lastModifiedDate).format("DD MMM HH:MM")}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTab;
