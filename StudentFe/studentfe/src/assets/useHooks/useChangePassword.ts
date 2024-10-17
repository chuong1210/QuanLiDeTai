import { useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { formChangePassword } from "@/assets/types/changePassword";
import { updatePassword } from "@/assets/config/apiRequests/StudentApiMutation";
import { toast } from "react-toastify";
import { ChangePasswordModalRefType } from "@/assets/types/modal";

export function useChangePassword() {
  const changePasswordModalRef = useRef<ChangePasswordModalRefType>(null);

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      changePasswordModalRef.current?.hideModal(); // or rest
      toast.success("Password successfully changed");

    },
    onError: (error: any) => {
      toast.error("An error occurred while updating the password");
    },
    
  });

  const handleSave = useCallback(
    async (data: formChangePassword) => {
      await updatePasswordMutation.mutateAsync(data);
    },
    [updatePasswordMutation]
  );

  const handleCancel = useCallback(() => {
    changePasswordModalRef.current?.hideModal();
  }, []);

  const showChangePasswordModal = useCallback(() => {
    changePasswordModalRef.current?.showModal();
  }, []);

  return {
    changePasswordModalRef,
    onSave: handleSave,
    onCancel: handleCancel,
    onShowChangePasswordModal: showChangePasswordModal,
  };
}


