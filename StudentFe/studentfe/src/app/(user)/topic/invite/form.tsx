import { API } from "@/assets/config";
import { http } from "@/assets/helpers";
import {
  InviteType,
  NotificationTypeInvitationInsertInput,
  StudentType,
} from "@/assets/interface";
import { ResponseType } from "@/assets/types/httpRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader } from "@/resources/components/UI";
import { InputText } from "@/resources/components/form/InputText";
import { InputTextArea } from "@/resources/components/form/InputTextArea";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { handleInvitation } from "@/assets/config/apiRequests/StudentApiMutation";

interface InviteFormRefType {
  show?: (data?: StudentType, selectedRows?: StudentType[]) => void;
  close?: () => void;
}

interface InviteFormType {
  title: string;
  onSuccess?: (faculty: StudentType) => void;
  onUpdateStudent?: (studentJoinId: number) => void; // thêm mới
  selectedRows?: StudentType[];
}

const defaultValues: InviteType = {
  message: "",
  studentJoinId: 0,
};

const schema = () =>
  yup.object({
    message: yup.string().required(),
    studentJoinId: yup.number(),
  });

const InviteForm = forwardRef<InviteFormRefType, InviteFormType>(
  ({ title, onSuccess, onUpdateStudent }, ref) => {
    const [visible, setVisible] = useState(false);

    const { control, handleSubmit, reset, getValues } = useForm({
      resolver: yupResolver(schema()) as Resolver<InviteType>,
      defaultValues,
    });

    const inviteMutation: any = useMutation<
      any,
      AxiosError<ResponseType>,
      NotificationTypeInvitationInsertInput
    >({
      mutationFn: (data: NotificationTypeInvitationInsertInput) => {
        return handleInvitation(data);
      },
    });

    // const inviteMutation = useMutation<
    //   any,
    //   AxiosError<ResponseType>,
    //   { message: string; studentJoinId: number }
    // >({
    //   mutationFn: (data) => {
    //     return http.post(API.post.invitation, data, {
    //       params: {
    //         removeFacultyId: true,
    //       },
    //     });
    //   },
    // });

    const show = (data?: StudentType, selectedRows?: StudentType[]) => {
      setVisible(true);
      if (data) {
        reset({
          message: "",
          studentJoinId: data.id,
        });
      }
    };

    const close = () => {
      setVisible(false);
      reset(defaultValues);
    };

    const onSubmit = (data: InviteType) => {
      console.log(getValues("studentJoinId"));
      inviteMutation.mutate(
        {
          isSendAllStudent: !data.message,

          studentIds: [getValues("studentJoinId")],
        },
        {
          onSuccess: (response: any) => {
            close();
            //  onSuccess?.(response.data); //  onSuccess?: (studentJoinId: number) => void; nó sẽ là cái này nếu ko sửa
            onUpdateStudent?.(response.data);
            toast.success("Cập nhật thành công");
          },
        }
      );
    };

    useImperativeHandle(ref, () => ({
      show,
      close,
    }));

    return (
      <Dialog
        header={title}
        visible={visible}
        style={{ width: "60vw" }}
        className="overflow-hidden"
        contentClassName="mb-8"
        onHide={close}
      >
        <Loader show={inviteMutation.isPending} />

        <form className="mt-2 gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="message"
            control={control}
            render={({ field, fieldState }) => (
              <InputTextArea
                id="form_data_message"
                value={field.value}
                row={true}
                label="Lời nhắn"
                placeholder="Lời nhắn"
                errorMessage={fieldState.error?.message}
                onChange={field.onChange}
              />
            )}
          />

          <div className="flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white p-4">
            <Button
              label="Hủy bỏ"
              icon="pi pi-undo"
              severity="secondary"
              onClick={(e) => {
                e.preventDefault();
                close();
              }}
            />
            <Button label="Lưu" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>
    );
  }
);

InviteForm.displayName = "Student Form";

export default InviteForm;
export type { InviteFormRefType };
