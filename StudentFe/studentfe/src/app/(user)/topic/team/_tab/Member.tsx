import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Fragment, useContext } from "react";
import { GroupPageContext } from "../[id]/page";
import TeamSection from "./TeamPage";
import Link from "next/link";
import { Button } from "primereact/button";
import { ROUTES } from "@/assets/config";

const MemberTab = () => {
  const { topic, groupDetail } = useContext(GroupPageContext);

  return (
    <div className="flex flex-column gap-5 bg-white border-round shadow-1 p-3">
      {parseInt(String(groupDetail?.countMember || "0"), 10) <= 4 && (
        <Fragment>
          <Link href={ROUTES.topic.invite}>
            <Button className="p-button p-component p-2">Mời thành viên</Button>
          </Link>
        </Fragment>
      )}
      <div>
        <div className="border-bottom-2 border-blue-500 px-3">
          <p className="font-semibold text-blue-500 text-2xl py-3">
            {"Hướng dẫn đề tài"}
          </p>
        </div>

        <div className="flex align-items-center gap-3 px-3 pt-4">
          <Avatar
            icon="pi pi-user"
            className="bg-primary text-white border-circle"
            size="normal"
          />
          <p>{topic?.subjects?.map((name) => name.name)}</p>
        </div>
      </div>

      <div>
        <div className="border-bottom-2 border-blue-500 px-3 flex align-items-center justify-content-between">
          <p className="font-semibold text-blue-500 text-2xl py-3">
            Thành viên
          </p>
          <p className="text-blue-500 font-semibold">
            {topic?.groups?.countMember} thành viên
          </p>
        </div>

        <div className="flex flex-column pt-3">
          {topic?.groups?.members?.map((member) => (
            <div key={member.student?.id}>
              <div className="flex align-items-center gap-3 pl-3">
                <Avatar
                  icon="pi pi-user"
                  className="bg-primary text-white border-circle"
                  size="normal"
                />
                <p>{member.student?.name}</p>
              </div>
              <Divider />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberTab;
