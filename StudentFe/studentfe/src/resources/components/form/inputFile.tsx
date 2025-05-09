"use client";

import { API } from "@/assets/config";
import { IMAGE_MIME_TYPE } from "@/assets/config/icon_file";
import { http } from "@/assets/helpers";
import { FileType, InputFileProps } from "@/assets/types/form";
import { ResponseType } from "@/assets/types/httpRequest";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { forEach } from "lodash";
import Link from "next/link";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { memo, useEffect, useRef, useState } from "react";
import { CustomImage, Loader } from "../UI";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { ConfirmModal } from "../modal";

const InputFile = memo(
  ({
    value,
    multiple,
    accept = "*",
    label,
    placeholder = "Danh sách file",
    folder,
    defaultValue,
    disabled,
    defaultFileText = "Mặc định",
    fileClassName = "col-3",
    hasDefault = true,
    showRemove = true,
    onChange = () => {},
  }: InputFileProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileType[]>(value || []);
    const [defaultFile, setDefaultFile] = useState<FileType | undefined>(
      defaultValue
    );
    const confirmModalRef = useRef<ConfirmModalRefType>(null);

    const fileMutation = useMutation<
      AxiosResponse<ResponseType<FileType>>,
      ResponseType<FileType>,
      { fileName: string; file: File }
    >({
      mutationFn: async (data) => {
        const formData = new FormData();

        formData.append("file", data.file);

        return http.post(
          `${API.post.google_drive}?fileName=${data.fileName}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      },
    });

    const onRemove = (data: number) => {
      onChange({
        file: defaultFile,
        files: files.filter((t, i) => i !== data),
      });
      setFiles(files.filter((t, i) => i !== data));
    };

    const File = ({ file }: { file: FileType }) => {
      const size = Math.ceil(file.sizeInBytes / 1024);

      return (
        <div className="flex align-items-center flex-1 gap-3">
          {IMAGE_MIME_TYPE[file.type] && (
            <Link href={file.path} target="_blank">
              <CustomImage
                src={file.path}
                alt={file.name}
                width="100"
                imageClassName="border-round"
              />
            </Link>
          )}

          <div className="flex flex-column align-items-start justify-content-between flex-1 gap-2">
            <Link
              href={file.path}
              target="_blank"
              className="text-primary"
              style={{ wordBreak: "break-all" }}
            >
              {file.name}
            </Link>

            <Tag
              value={
                size >= 1024 ? Math.ceil(size / 1024) + " MB" : size + " KB"
              }
              severity={"warning"}
            />
          </div>
        </div>
      );
    };

    useEffect(() => {
      if (value) {
        setFiles(value);
        setDefaultFile(value[0]);
      }
    }, [value]);

    useEffect(() => {
      if (defaultValue) {
        setDefaultFile(defaultValue);
      }
    }, [defaultValue]);

    return (
      <div>
        {label && <p className="mb-2 font-medium text-800">{label}</p>}

        <div className="border-round-xl bg-white border-1 border-solid border-300 relative overflow-hidden">
          <Loader show={fileMutation.isPending} />

          <input
            type="file"
            value=""
            accept={accept}
            ref={inputRef}
            multiple={multiple}
            hidden={true}
            onChange={(e) => {
              if (!e.target.files) {
                return;
              }

              if (multiple) {
                forEach(e.target.files, async (file) => {
                  try {
                    const response = await fileMutation.mutateAsync({
                      fileName: folder + file.name.split(".")[0],
                      file,
                    });

                    if (response.data.result) {
                      setFiles((prev) => {
                        onChange({
                          files: [...prev, response.data.result!],
                        });

                        return [...prev, response.data.result!];
                      });
                    }
                  } catch (error: any) {}
                });
              } else {
                fileMutation.mutate(
                  {
                    fileName: folder + e.target.files[0].name.split(".")[0],
                    file: e.target.files[0],
                  },
                  {
                    onSuccess(response) {
                      if (response.data.result) {
                        onChange({
                          file: response.data.result!,
                          files: [response.data.result!],
                        });

                        setFiles([response.data.result]);
                        setDefaultFile(response.data.result);
                      }
                    },
                  }
                );
              }
            }}
          />

          {!disabled && (
            <div
              className="flex align-items-center gap-3 px-3 border-bottom-1 border-300"
              style={{ height: 47 }}
            >
              <Button
                rounded={true}
                outlined={true}
                icon="pi pi-fw pi-file"
                className="w-2rem h-2rem"
                onClick={(e) => {
                  e.preventDefault();

                  inputRef.current?.click();
                }}
              />

              <Button
                visible={showRemove}
                rounded={true}
                outlined={true}
                icon="pi pi-fw pi-trash"
                severity="danger"
                className="w-2rem h-2rem"
                onClick={(e) => {
                  e.preventDefault();

                  setFiles([]);
                }}
              />
            </div>
          )}

          <div className="p-3 flex flex-wrap overflow-auto">
            {files.length > 0 ? (
              files?.map((file, index) => (
                <div
                  className={classNames(
                    "flex align-items-center gap-3 py-3",
                    fileClassName
                  )}
                  key={file.name + "_" + file.sizeInBytes}
                >
                  {!disabled && (
                    <div className="flex flex-column gap-3 align-items-center">
                      {multiple && hasDefault && (
                        <RadioButton
                          tooltip={defaultFileText}
                          tooltipOptions={{ position: "left" }}
                          className={classNames(
                            `.${file.name + "_" + file.sizeInBytes}`
                          )}
                          checked={defaultFile?.name === file.name}
                          onChange={() => {
                            setDefaultFile(file);

                            onChange({
                              file,
                              files,
                            });
                          }}
                        />
                      )}
                      <i
                        className="pi pi-trash cursor-pointer hover:text-red-600"
                        onClick={(e) => {
                          confirmModalRef.current?.show?.(
                            e,
                            index,
                            "Bạn có chắc muốn xóa file này"
                          );
                        }}
                      />
                    </div>
                  )}
                  <File file={file} />
                </div>
              ))
            ) : (
              <div>{placeholder}</div>
            )}
          </div>
        </div>

        <ConfirmModal
          ref={confirmModalRef}
          onAccept={onRemove}
          acceptLabel="Đồng ý"
          rejectLabel="Hủy"
        />
      </div>
    );
  }
);

InputFile.displayName = "InputFile";

export { InputFile };
