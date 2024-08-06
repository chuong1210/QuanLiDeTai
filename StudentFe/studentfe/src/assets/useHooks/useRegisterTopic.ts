// useRegisterTopic.ts
import { useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { NotificationCardModalRefType } from "@/assets/types/modal";
import { ROUTES } from "@/assets/config";
import { TopicType } from "../interface";
import { useRouter } from "next/navigation";
import { registerTopicAPI } from "../config/apiRequests/StudentApiMutation";
import { AxiosError } from "axios";
import { ResponseType } from "../types/httpRequest";
import handler from '../../mocks/index';
export function useRegisterTopic() {
  const router = useRouter();
  let newData: TopicType;

  const notificationModalRef = useRef<NotificationCardModalRefType>(null);

 
  // const registerTopicMutation = useMutation<ResponseType, AxiosError, TopicType>({
  //   mutationFn: (data:TopicType) => 
  //     {
  //      newData = { ...data, researchID: data.id };

  //     return  registerTopicAPI(newData)
  //     },
  //   onSuccess: () => {
  //     notificationModalRef.current?.showModal();
      
  //     router.push(`${ROUTES.topic.register_topic}?activeItem=register_topic&openMenu=false&parent=thesis`);
  //   },
  //   onError: (error: any) => {
  //     toast.error("Đã xảy ra lỗi khi đăng ký đề tài");
  //   },
  // });
 
  // const handleRegister = useCallback(
  //   async (data: TopicType) => {
  //     await registerTopicMutation.mutateAsync( data);
  //   },
  //   [registerTopicMutation]
  // );

    const handlerNotification = useCallback(
    async () => {
      await   notificationModalRef.current?.showModal();
      
    },
    []
  );
  const showNotificationModal = useCallback(() => {
    notificationModalRef.current?.showModal();
  }, []);

  return {
    notificationModalRef,
    onNotification: handlerNotification,
    onShowNotificationModal: showNotificationModal,
  };
}