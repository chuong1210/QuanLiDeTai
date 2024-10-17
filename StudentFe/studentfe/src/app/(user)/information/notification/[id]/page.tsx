"use client";

import { HTML } from "@/assets/helpers/string";
import { useGetDetail } from "@/assets/useHooks/useGet";
import { NotificationParamType, NotificationType } from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import moment from "moment";
import { Card } from "primereact/card";
import { da } from "date-fns/locale";
import { useRouter } from "next/navigation";

const NotificationDetailPage = ({ params: { id } }: PageProps) => {
  const { data } = useGetDetail<NotificationType, NotificationParamType>({
    module: "notification",
    params: { id },
  });

  const dataO = data?.result;
  const router = useRouter();
  const handleClose = () => {
    router.back;
  };
  return (
    <Card
      className="mr-2 relative overflow-hidden"
      title={
        <div className="flex align-items-center justify-content-between">
          <p className="flex-1">{dataO?.name}</p>
          <p className="text-sm font-normal text-600">
            {moment(dataO?.lastModifiedDate).format("DD/MM/YYYY")}
            Hello NotificationPage
          </p>
        </div>
      }
    >
      <p dangerouslySetInnerHTML={HTML(dataO?.content)} className="text-900" />
    </Card>
  );
};

export default NotificationDetailPage;
