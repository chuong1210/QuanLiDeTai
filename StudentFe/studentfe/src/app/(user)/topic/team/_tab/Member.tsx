import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { useContext } from "react";
import { GroupPageContext } from "../[id]/page";

const MemberTab = () => {
  const { topic } = useContext(GroupPageContext);

  return (
    <div className="flex flex-column gap-5 bg-white border-round shadow-1 p-3">
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
