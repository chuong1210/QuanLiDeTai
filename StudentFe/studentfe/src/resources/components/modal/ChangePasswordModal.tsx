import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import * as yup from "yup";
import {
  ChangePasswordModalRefType,
  ChangePasswordModalType,
} from "@/assets/types/modal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Password } from "../form/Password";
import { formChangePassword } from "@/assets/types/changePassword";

const ChangePasswordModal = React.forwardRef<
  ChangePasswordModalRefType,
  ChangePasswordModalType
>(({ onSave, onCancel }, ref) => {
  const passwordSchema = yup
    .object({
      password: yup.string().required("Old password is required"),
      newPassword: yup
        .string()
        .min(6, "Password must be at least 6 characters long")
        .required("New password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your new password"),
    })
    .required();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useImperativeHandle(ref, () => ({
    showModal: () => setIsVisible(true),
    resetModal: () => reset(),
    hideModal: () => {
      reset();
      setIsVisible(false);
    },
  }));

  const onHide = () => {
    setIsVisible(false);
    onCancel();
  };
  const onSubmit = (data: formChangePassword) => {
    onSave(data);
  };
  return (
    <Dialog
      header="Đổi mật khẩu"
      visible={isVisible}
      onHide={onHide}
      breakpoints={{ "960px": "75vw", "640px": "100vw" }}
      style={{ width: "30vw" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="password" // must be the same as the schema section
          control={control}
          render={({ field }) => (
            <Password
              id="currentPassword"
              label="Current Password"
              placeholder="Current Password"
              {...field}
              errorMessage={errors.password?.message}
            />
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Password
              id="newPassword"
              label="New Password"
              placeholder="New Password"
              {...field}
              errorMessage={errors.newPassword?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Password
              id="confirmNewPassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              {...field}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />
        <div className="flex justify-content-end mt-2">
          <Button label="Cancel" onClick={onHide} className="p-button-text" />
          <Button label="Change" type="submit" className="ml-2" />
        </div>
      </form>
    </Dialog>
  );
});

ChangePasswordModal.displayName = "ChangePasswordModal";

export default ChangePasswordModal;
