import { API } from "@/assets/config";
import { http } from "@/assets/helpers";
import { useGetList } from "@/assets/useHooks/useGet";
import { InviteParamType, InviteType } from "@/assets/interface";
import { Loader } from "@/resources/components/UI";
import { useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { useContext } from "react";
import { toast } from "react-toastify";
import { NotificationPageContext } from "../page";

const InviteTab = () => {
  // const { lng, tab } = useContext(NotificationPageContext);
  const inviteQuery = useGetList<InviteType, InviteParamType>({
    module: "notification",
    // params: {
    //   isGetGroup: true,
    // },
  });

  const recallInviteMutate = useMutation({
    mutationFn: (data: { id: number; status: string }) => {
      return http.update(API.post.change_invite_status, {
        id: data.id,
        status: data.status,
      });
    },
  });

  return (
    <div className="relative overflow-hidden p-3 border-round-xl bg-white shadow-2 flex flex-column gap-3">
      <Loader show={inviteQuery.isFetching || recallInviteMutate.isPending} />

      {inviteQuery.response?.result && inviteQuery.response.result.length > 0
        ? inviteQuery.response?.result.map((invite) => (
            <div
              key={invite.id}
              className="border-1 border-300 border-round-xl p-3 flex flex-column gap-3"
            >
              <p className="font-semibold">{invite.group?.name}</p>
              <p>{invite.message}</p>

              <div className="flex justify-content-end align-items-center gap-3">
                <Button
                  label="Từ chối"
                  size="small"
                  outlined={true}
                  severity="secondary"
                  onClick={() => {
                    recallInviteMutate.mutate(
                      {
                        id: invite.id!,
                        status: "C",
                      },
                      {
                        onSuccess: () => {
                          toast.success("Hủy yêu cầu thành công");
                          inviteQuery.refetch();
                        },
                      }
                    );
                  }}
                />
                <Button
                  label="Chấp nhận"
                  size="small"
                  onClick={() => {
                    recallInviteMutate.mutate(
                      {
                        id: invite.id!,
                        status: "A",
                      },
                      {
                        onSuccess: () => {
                          toast.success("Chấp nhận lời mời thành công");
                          inviteQuery.refetch();
                        },
                      }
                    );
                  }}
                />
              </div>
            </div>
          ))
        : !inviteQuery.isFetching && (
            <p className="text-800 font-semibold text-center py-3">
              Chưa có lời mời gửi đến bạn
            </p>
          )}
    </div>
  );
};

export default InviteTab;
