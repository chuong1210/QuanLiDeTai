import React from "react";
import { GroupPageContext } from "../../topic/team/[id]/page";

const page = () => {
  return (
    //   <GroupPageContext.Provider value={null}>
    //     <Loader show={topicDetail.isFetching || jobDetail.isFetching} />
    //     <div className="header justify-content-between flex flex-row  align-items-center mr-3  ">
    //       {/* base line cung dc */}
    //       <h1>Thao tác trong nhóm & đăng ký đề tài</h1>

    //       {groupDetail.data &&
    //         groupDetail.data.result &&
    //         groupDetail.data.result.students &&
    //         groupDetail.data.result.students.length < 10 && (
    //           <Fragment>
    //             <Link href={ROUTES.topic.invite} className="inline-block">
    //               <Button
    //                 label="Mời thêm thành viên vào nhóm"
    //                 className="p-button-outlined p-button-secondary max-h-3rem "
    //                 style={{ float: "right", borderRadius: "1rem 16px" }}
    //               />
    //             </Link>
    //           </Fragment>
    //         )}
    //     </div>

    //     {/* {typeof groupDetail.data?.result?.countMember === "number" || */}

    //     {/* {+(groupDetail.data?.result?.countMember || 0) <= 4} */}
    //     {/* {parseInt(String(groupDetail.data?.result?.countMember || "0"), 10) <=
    //   4 && (
    //   <Fragment>
    //     <Link href={ROUTES.topic.invite}>
    //       <Button className="p-button p-component p-2">Mời thành viên</Button>
    //     </Link>
    //   </Fragment>
    // )} */}
    //     <div className="flex align-items-center border-bottom-2 border-200 bg-white border-round overflow-hidden">
    //       {TABS.map((tab) => (
    //         <div
    //           key={tab.value}
    //           className={classNames(
    //             "px-5 py-3 cursor-pointer hover:text-primary border-bottom-3 border-transparent font-semibold",
    //             {
    //               "text-900": tab.value != activeTab,
    //               "text-primary border-primary": tab.value === activeTab,
    //             }
    //           )}
    //           onClick={() => setActiveTab(tab.value?.toString()!)}
    //         >
    //           {tab.label}
    //         </div>
    //       ))}
    //     </div>
    //     <div
    //       className="mt-3"
    //       style={{
    //         maxWidth: 1000,
    //         margin: "0 auto",
    //       }}
    //     >
    //       {/* {activeTab === "news" && <NewsTab />} */}
    //       {activeTab === "exercise" && <ExerciseTab />}
    //       {activeTab === "member" && <MemberTab />}
    //       {activeTab === "point" && <ResultTab />}
    //       {activeTab === "job" && <JobPlanTab />}

    //       {activeTab === "team" && <TeamPageTab />}
    //     </div>
    //   </GroupPageContext.Provider>
    <div></div>
  );
};

export default page;
