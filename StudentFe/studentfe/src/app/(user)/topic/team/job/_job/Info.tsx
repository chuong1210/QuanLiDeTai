import { HTML } from "@/assets/helpers/string";
import moment from "moment";
import { useContext } from "react";
import { JobPageContext } from "../[id]/page";

const JobInfo = () => {
  const { job } = useContext(JobPageContext);

  return (
    <>
      <p className="font-semibold text-3xl text-blue-700 mt-1">{job?.name}</p>

      <div className="flex align-items-center justify-content-between my-3">
        <p className="text-sm text-700">
          {job?.teacherBy?.name} •{" "}
          {moment(job?.lastModifiedDate).format("DD MMM")}
        </p>
        <p className="text-sm font-semibold text-900">
          Đến hạn {moment(job?.due).format("HH:mm DD MMM")}
        </p>
      </div>

      <div dangerouslySetInnerHTML={HTML(job?.instructions)} />
    </>
  );
};

export default JobInfo;
