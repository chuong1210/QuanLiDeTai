import React, { useContext, useState, useEffect } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { BreadCrumb } from "primereact/breadcrumb";
import { MenuItem } from "primereact/menuitem";
import { PANEL_MENU } from "@/assets/config/menu/panel_menu";
import { useGetDetail } from "@/assets/useHooks/useGet";
import { JobParamType, JobType } from "@/assets/interface";
import { GroupPageContext } from "../[id]/page";
import moment from "moment";

const JobPlan: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const [jobDetail, setJobDetail] = useState<JobType | null>(null); // State to hold job detail
  const items = PANEL_MENU();
  const { groupDetail } = useContext(GroupPageContext);

  const jobData = useGetDetail<JobType, JobParamType>({
    module: "job",

    enabled: groupDetail ? true : false,
  });

  useEffect(() => {
    if (jobData?.data) {
      setJobDetail(jobData.data.result); // Assuming jobData.data contains the job detail
    }
  }, [jobData]);

  const toggleAll = () => {
    if (Object.keys(expandedKeys).length) {
      collapseAll();
    } else {
      expandAll();
    }
  };

  const expandAll = () => {
    const newExpandedKeys = {};
    items.forEach((item) => expandNode(item, newExpandedKeys));
    setExpandedKeys(newExpandedKeys);
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const expandNode = (node: any, expandedKeysObj: any) => {
    expandedKeysObj[node.key] = true;
    if (node.items && node.items.length) {
      node.items.forEach((childNode: any) =>
        expandNode(childNode, expandedKeysObj)
      );
    }
  };

  const handlePanelToggle = (e: any, node: any) => {
    if (expandedKeys[node.key]) {
      setExpandedKeys((prevKeys: any) => {
        const newKeys = { ...prevKeys };
        delete newKeys[node.key];
        return newKeys;
      });
    } else {
      setExpandedKeys((prevKeys: any) => ({
        ...prevKeys,
        [node.key]: true,
      }));
    }
  };

  return (
    <div className="card max-h-full gap-3">
      <PanelMenu
        model={items.map((item) => ({
          ...item,
          // Add content for each panel
          content: jobDetail && (
            <div>
              <h5>{jobDetail.name}</h5> {/* Tên công việc */}
              <p>
                <strong>Miêu tả:</strong> {jobDetail.description}
              </p>{" "}
              {/* Miêu tả */}
              <p>
                <strong>Chi tiết:</strong> {jobDetail.detail}
              </p>{" "}
              {/* Chi tiết */}
              <p>
                <strong>Thời gian bắt đầu:</strong> {jobDetail.from.toString()}
              </p>{" "}
              {/* Thời gian bắt đầu */}
              <p>
                <p>
                  <strong>Thời gian kết thúc:</strong>
                  {jobDetail.due
                    ? moment(jobDetail.due.toString()).format("DD/MM/YYYY")
                    : "Không có thông tin"}
                </p>
              </p>{" "}
              {/* Thời gian kết thúc */}
              <p>
                <strong>Trạng thái hoàn thành:</strong>{" "}
                {jobDetail.isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
              </p>{" "}
              {/* Trạng thái */}
            </div>
          ),
        }))}
        expandedKeys={expandedKeys}
        onExpandedKeysChange={(e) => setExpandedKeys(e.value)}
        className="w-full md:w-20rem"
        multiple
      />
    </div>
  );
};

export default JobPlan;
