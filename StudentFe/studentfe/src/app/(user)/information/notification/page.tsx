"use client";

import { ROUTES } from "@/assets/config";
import { useGetList } from "@/assets/useHooks/useGet";
import { NotificationParamType, NotificationType } from "@/assets/interface";
import { PageProps } from "@/assets/types/UI";
import { Loader } from "@/resources/components/UI";
import Link from "next/link";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import { createContext, useState } from "react";
import { InviteTab, NotificationTab } from "./_slug/index";
import moment from "moment";
import CustomImage from "@/resources/components/UI/Image";

interface NotificationPageContextType {
  tab: "IV" | "NT";
}

const NotificationPageContext = createContext<NotificationPageContextType>({
  tab: "NT",
});

const NotificationPage = ({ params: { id } }: PageProps) => {
  const [tab, setTab] = useState<"NT" | "IV">("NT");
  const { isLoading, response } = useGetList<
    NotificationType,
    NotificationParamType
  >({
    module: "notification",
    params: {
      filters: `lastModifiedDate>=${moment()
        .subtract({ day: 7 })
        .format("yyyy-MM-DD")}`,
    },
  });

  const value = {
    tab,
  };

  return (
    <NotificationPageContext.Provider value={value}>
      <div className="pr-2 flex">
        <div className="col-7">
          <div className="flex align-items-center gap-3 mb-3">
            <div
              className={classNames(
                "flex p-ripple px-5 py-2 border-round-3xl cursor-pointer",
                {
                  "bg-primary": tab == "NT",
                  "surface-400": tab != "NT",
                }
              )}
              onClick={() => setTab("NT")}
            >
              {"Thông báo"}
              <Ripple />
            </div>

            <div
              className={classNames(
                "flex p-ripple px-5 py-2 border-round-3xl cursor-pointer",
                {
                  "surface-400": tab != "IV",
                  "bg-primary": tab == "IV",
                }
              )}
              onClick={() => setTab("IV")}
            >
              {"Lời mời"}
              <Ripple />
            </div>
          </div>

          {tab == "NT" && <NotificationTab />}

          {tab == "IV" && <InviteTab />}
        </div>

        <div className="col-5">
          <Card
            title={"Thông báo gần đây"}
            className="relative overflow-hidden"
          >
            <Loader show={isLoading} />

            <div className="flex flex-column gap-5">
              {response?.data?.map((notification, index: number) => (
                <div
                  key={notification.id}
                  className="flex gap-3 cursor-pointer"
                >
                  <CustomImage
                    key={index}
                    src={notification.image?.path}
                    alt="hi"
                    width="100"
                    imageClassName="shadow-3 border-round"
                  />

                  <div className="flex flex-column justify-content-between flex-1">
                    <Link
                      key={index}
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
          </Card>
        </div>
      </div>
    </NotificationPageContext.Provider>
  );
};

export default NotificationPage;
export { NotificationPageContext };
