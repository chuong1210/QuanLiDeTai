"use client";

import { API, ACCESS_TOKEN, ROUTES, REFRESH_TOKEN } from "@/assets/config";
import { cookies } from "@/assets/helpers";
import { http } from "@/assets/helpers";
import { PageProps } from "@/assets/types/UI";

import { yupResolver } from "@hookform/resolvers/yup";
import { Loader } from "@/resources/components/UI";
import { InputText } from "@/resources/components/form/InputText";
import { Password } from "@/resources/components/form/Password";
// import brand from "@resources/image/info/brand.png";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { redirect, useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { ResponseType } from "@/assets/types/httpRequest";
import { FormStateType } from "@/assets/types/loginform";
import LoginForm from "@/resources/components/form/LoginForm";
import {
  AuthType,
  AuthTypeLogin,
  AuthTypeParamType,
  GroupParamType,
  GroupType,
  StudentType,
} from "@/assets/interface";
import {
  loginStudent,
  refreshTokenApi,
} from "@/assets/config/apiRequests/StudentApiMutation";
import {
  useGetDetail,
  useGetListWithPagination,
} from "@/assets/useHooks/useGet";
import { request } from "http";
import { NextRequest } from "next/server";
import { useUser } from "@/assets/context/UserContext";
import SaveTokenModal from "@/resources/components/modal/SaveTokenModal";
import { useUserStore } from "@/assets/zustand/user";
import { useDispatch } from "react-redux";

const formData: FormStateType = {
  username: "",
  password: "",
};

const schema = yup.object({
  userName: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
  // remember_password: yup.boolean(),
});

const Page = () => {
  const { setUser, setHasGroup } = useUser();
  const dispatch = useDispatch();
  const userStore = useUserStore(); // Access the store
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  // const { control, handleSubmit, formState } = useForm({
  //   resolver: yupResolver(schema),
  // });
  const [formStateUser, setFormState] = useState<FormStateType>(formData);
  const [userName, setUserName] = useState<string>("");
  const handleChange =
    (name: keyof FormStateType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [name]: event.target.value }));
    };

  const signInMutation: any = useMutation<
    ResponseType<AuthTypeLogin>,
    Error,
    FormStateType
  >({
    mutationFn: (data: FormStateType) => {
      return loginStudent(data);
    },
  });

  const userQuery = useGetDetail<AuthType, AuthTypeParamType>({
    // nên dùng use context
    module: "user",
    params: { userName: userName }, // Assuming 'id' is available after successful login
    enabled: !!cookies.get(ACCESS_TOKEN), // Only fetch if logged in
  });

  const groupQuery = useGetDetail<GroupType, GroupParamType>({
    // nên dùng use context
    module: "group",
    enabled: !!cookies.get(ACCESS_TOKEN), // Only fetch if logged in
  });
  const onSubmit = () => {
    signInMutation.mutate(formStateUser, {
      onSuccess(response: ResponseType<AuthTypeLogin>) {
        try {
          const accessToken = response?.result?.accessToken;
          if (accessToken) {
            setTempToken(accessToken); // Set the temporary token
            setShowModal(true); // Show the modal
            // const headersList = headers();
            // headersList.set(
            //   "Set-Cookie",
            //   `accessToken=${accessToken}; HttpOnly; Secure; SameSite=strict`
            // );
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false); // Stop loading
        }
      },
      onError() {
        setIsLoading(false); // Stop loading on error
      },
    });
  };
  // if (userQuery.isSuccess && userQuery.data) {
  //   // localStorage.setItem("user", JSON.stringify(userQuery.data.result));
  //   setUser(userQuery.data?.result || null);
  // }

  // useEffect(() => {
  //   const storedHasGroup = localStorage.getItem("hasGroup");
  //   setHasGroup(storedHasGroup === "true"); // Parse the stored value as boolean
  // }, [setHasGroup]);
  // if (groupQuery.isSuccess && groupQuery.data.result) {
  //   // Store the hasGroup value in localStorage
  //   localStorage.setItem(
  //     "hasGroup",
  //     JSON.stringify(groupQuery.data.result ? true : false)
  //   );
  // }

  useEffect(() => {
    // Chỉ set user nếu có dữ liệu mới
    if (userQuery.isSuccess && userQuery.data?.result) {
      const userData = userQuery.data?.result;

      // Kiểm tra nếu user trong store khác với user hiện tại, thì mới cập nhật
      if (userStore.user !== userData) {
        setUser(userData);
        userStore.setUser(userData);
      }
    }
  }, [userQuery.isSuccess, userQuery.data, setUser, userStore]);

  useEffect(() => {
    const storedHasGroup = localStorage.getItem("hasGroup");

    // Chỉ set hasGroup nếu giá trị khác
    if (storedHasGroup === "true" && !userStore.hasGroup) {
      setHasGroup(true);
    } else if (storedHasGroup !== "true" && userStore.hasGroup) {
      setHasGroup(false);
    }
  }, [setHasGroup, userStore.hasGroup]);

  useEffect(() => {
    if (groupQuery.isSuccess && groupQuery.data?.result) {
      const hasGroup = groupQuery.data?.result ? true : false;

      // Chỉ cập nhật nếu giá trị đã thay đổi
      if (userStore.hasGroup !== hasGroup) {
        setHasGroup(hasGroup);
        userStore.setHasGroup(hasGroup);

        // Store the hasGroup value in localStorage
        localStorage.setItem("hasGroup", JSON.stringify(hasGroup));
      }
    }
  }, [groupQuery.isSuccess, groupQuery.data, setHasGroup, userStore]);

  const handleSaveToken = () => {
    if (tempToken) {
      const tokenData = jwtDecode(tempToken) as any;

      cookies.set(ACCESS_TOKEN, tempToken);
      cookies.set(REFRESH_TOKEN, tempToken);
      setShowModal(false);
      router.push(ROUTES.home.index);
    }
    setIsLoading(true);
  };

  const handleDiscardToken = () => {
    if (tempToken) {
      const tokenData = jwtDecode(tempToken) as any;
      const expirationDate = tokenData.exp
        ? new Date(tokenData.exp * 1000)
        : new Date(Date.now() + 3600 * 1000);
      const claimRefresh = "expirationTime_Refresh";

      const expirationTimeRefresh = new Date(tokenData[claimRefresh] * 1000);
      cookies.set(ACCESS_TOKEN, tempToken, { expires: expirationDate });
      cookies.set(REFRESH_TOKEN, tempToken, { expires: expirationTimeRefresh });
      setShowModal(false);
      router.push(ROUTES.home.index);
      setHasGroup(groupQuery.data?.result ? true : false);
    }
    setIsLoading(true);
  };

  return (
    <div className="flex align-items-center justify-content-center h-full w-full p-0">
      <div className="flex flex-wrap shadow-2 w-full border-round-2xl overflow-hidden">
        <Loader show={isLoading} />

        <div className="w-full lg:w-6 p-4 lg:p-7 bg-blue-50">
          <div className="pb-3">
            {/* <Image src={brand.src} alt="Image" height="80" /> */}
          </div>
          <div className="text-xl text-black-alpha-90 font-500 mb-3">
            {"Chào mừng tới kênh quản lí đề tài"}
          </div>
          <p className="text-black-alpha-50 line-height-3 mt-0 mb-6">
            Chào bạn{" "}
          </p>
          <ul className="list-none p-0 m-0">
            <li className="flex align-items-start mb-4">
              <div>
                <Button icon={PrimeIcons.INBOX} severity="help" />
              </div>
              <div className="ml-3">
                <span className="font-medium text-black-alpha-90">
                  Unlimited Inbox
                </span>
                <p className="mt-2 mb-0 text-black-alpha-50 line-height-3">
                  Hello{" "}
                </p>
              </div>
            </li>
            <li className="flex align-items-start mb-4">
              <div>
                <Button icon={PrimeIcons.SHIELD} severity="help" />
              </div>
              <div className="ml-3">
                <span className="font-medium text-black-alpha-90">
                  Premium Security
                </span>
                <p className="mt-2 mb-0 text-black-alpha-50 line-height-3">
                  Hello{" "}
                </p>
              </div>
            </li>
            <li className="flex align-items-start">
              <div>
                <Button icon={PrimeIcons.GLOBE} severity="help" />
              </div>
              <div className="ml-3">
                <span className="font-medium text-black-alpha-90">
                  Cloud Backups Inbox
                </span>
                <p className="mt-2 mb-0 text-black-alpha-50 line-height-3">
                  Hello{" "}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <LoginForm
          onSubmit={onSubmit}
          formStateUser={formStateUser}
          handleChange={handleChange}
          signInMutation={signInMutation}
        />
      </div>
      <SaveTokenModal
        visible={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveToken}
        onDiscard={handleDiscardToken}
      />
    </div>
  );
};

export default Page;

// <div className="w-full lg:w-6 p-4 lg:p-7 surface-card">
// <div className="flex align-items-center justify-content-center mb-7">
//   <span className="text-2xl font-medium text-900">
//     Đăng nhập để tiếp tục
//   </span>
//   {/* <a
//     tabIndex={0}
//     className='font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150'
//   >
//     Sign up
//   </a> */}
// </div>
// <form
//   className="flex flex-column gap-4"
//   onSubmit={handleSubmit(onSubmit)}
// >
//   <Controller
//     name="userName"
//     control={control}
//     render={({ field, formState }) => (
//       <InputText
//         id="account"
//         label={"Tài khoản"}
//         placeholder={"Tài khoản"}
//         errorMessage={formState.errors.userName?.message}
//         //  value={field.value}
//         value={formStateUser.username}
//         //    onChange={field.onChange}
//         onChange={(e) => {
//           field.onChange(e);
//           handleChange("username")(e);
//         }}
//         onBlur={field.onBlur}
//       />
//     )}
//   />

//   <Controller
//     name="password"
//     control={control}
//     render={({ field, formState }) => (
//       <Password
//         id="password"
//         label={"Mật khẩu"}
//         placeholder={"Mật khẩu"}
//         errorMessage={formState.errors.password?.message}
//         value={formStateUser.password}
//         //       value={field.value}

//         //    onChange={field.onChange}
//         onChange={(e) => {
//           field.onChange(e);
//           handleChange("password")(e);
//         }}
//         onBlur={field.onBlur}
//       />
//     )}
//   />

//   <div className="flex align-items-center justify-content-between">
//     <div>
//       {signInMutation.isError && (
//         <small className="p-error">Đăng nhập thất bại</small>
//       )}
//       {/* <Controller
//       name='remember_password'
//       control={control}
//       render={({ field }) => (
//         <Checkbox
//           id='remember_password'
//           value={field.value}
//           label={t('remember_password')}
//           onChange={(e) => field.onChange(e.checked)}
//         />
//       )}
//     /> */}
//     </div>
//     <a className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150">
//       {"Quên mật khẩu"}
//     </a>
//   </div>

//   <Button
//     label={"Đăng nhập"}
//     className="w-full font-medium py-3 "
//     rounded={true}
//   />
// </form>
// </div>
