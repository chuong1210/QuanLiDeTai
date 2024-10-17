"use client";
import React from "react";

// pages/change-password.js
import { useRef } from "react";
import ChangePasswordModal from "@/resources/components/modal/ChangePasswordModal";
import { ChangePasswordModalRefType } from "@/assets/types/modal";
import { Button } from "primereact/button";
import { formChangePassword } from "@/assets/types/changePassword";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/assets/config/apiRequests/StudentApiMutation";
import { toast } from "react-toastify";
import { useUserStore } from "@/assets/zustand/user";

const Page = () => {
  const { user } = useUserStore();
  const changePasswordModalRef = useRef<ChangePasswordModalRefType>(null);
  const updatePasswordMutation: any = useMutation({
    mutationFn: (data: formChangePassword) => {
      return updatePassword(data);
    },
  });
  const currentUser = user?.username ?? "";
  const onSubmit = async (data: formChangePassword) => {
    try {
      await updatePasswordMutation.mutateAsync({
        password: data.password,
      });
      changePasswordModalRef.current?.resetModal(); // Reset form trong modal nếu có thể tham chiếu và đã định nghĩa reset() trong ChangePasswordModalRefType
    } catch (error) {
      toast("error");
    }
  };
  const handleCancel = () => {
    console.log("Password update cancelled");
    changePasswordModalRef.current?.hideModal();
  };

  const showChangePasswordModal = () => {
    if (changePasswordModalRef.current) {
      changePasswordModalRef.current.showModal();
    }
  };

  return (
    <>
      <h1>Change Password Page</h1>
      <Button label="Change Password" onClick={showChangePasswordModal} />
      <ChangePasswordModal
        ref={changePasswordModalRef}
        onSave={onSubmit}
        onCancel={handleCancel}
        username={currentUser}
      />
    </>
  );
};

export default Page;
