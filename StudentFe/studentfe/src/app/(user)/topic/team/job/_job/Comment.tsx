import moment from "moment";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { useContext, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { JobPageContext } from "../[id]/page";
import { InputTextarea } from "primereact/inputtextarea";

interface JobCommentsProps {
  onSubmit: (_content: string) => void;
}

const JobComments = ({ onSubmit }: JobCommentsProps) => {
  const { comments } = useContext(JobPageContext);
  const [content, setContent] = useState("");

  return (
    <div>
      <div className="flex flex-column gap-4 max-h-25rem overflow-auto">
        {comments &&
          comments?.length > 0 &&
          comments?.map((feedback) => (
            <div key={feedback.id} className="flex gap-2 align-items-start">
              <Avatar
                icon="pi pi-user"
                className="bg-primary text-white border-circle"
              />

              <div className="flex flex-column gap-2">
                {feedback?.teacher?.name || feedback?.student?.name}
                <Chip label={feedback?.content} className="bg-gray-200" />
                <p className="text-xs">
                  {moment(feedback?.lastModifiedDate).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-4 flex flex-column gap-3">
        <div className="flex align-items-center gap-3">
          <FaUserGroup />
          <p className="text-900 font-semibold">Nhận xét về công việc</p>
        </div>

        <div className="flex gap-3">
          <Avatar
            icon="pi pi-user"
            className="bg-primary text-white border-circle mt-1"
            size="normal"
          />

          <InputTextarea
            autoResize={true}
            rows={2}
            value={content}
            className="border-round-3xl flex-1 text-sm"
            placeholder="Thêm nhận xét cho công việc"
            onChange={(e) => setContent(e.target.value)}
          />

          {content && (
            <Button
              icon="pi pi-send"
              className="w-2rem h-2rem mt-1"
              rounded={true}
              onClick={(e) => {
                e.preventDefault();
                setContent("");
                onSubmit(content);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobComments;
