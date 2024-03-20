"use client";

import { API, AUTH_RAW_TOKEN, AUTH_TOKEN, ROUTES } from "@/assets/config";
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
import { useState } from "react";
import { loginStudent } from "@/assets/config/apis/studentapi";
import { ResponseType } from "@/assets/types/httpRequest";
import { FormStateType } from "@/assets/types/loginform";
import LoginForm from "@/resources/components/form/LoginForm";
import { headers } from "next/headers";

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
  const router = useRouter();
  // const { control, handleSubmit, formState } = useForm({
  //   resolver: yupResolver(schema),
  // });
  const [formStateUser, setFormState] = useState<FormStateType>(formData);

  const handleChange =
    (name: keyof FormStateType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [name]: event.target.value }));
    };
  // const signInMutation = useMutation({
  //   mutationFn: (data: any) => {
  //     return http.post(API.auth.sign_in, {
  //       // userName: data.userName,
  //       // password: data.password,
  //       username,
  //       password,
  //     });
  //   },
  // });

  const signInMutation: any = useMutation({
    mutationFn: (data: FormStateType) => {
      console.log("username", data.username);
      console.log("username", data.password);

      return loginStudent(data);
    },
  });

  const onSubmit = () => {
    signInMutation.mutate(formStateUser, {
      onSuccess(response: ResponseType) {
        try {
          console.log("asasadouahhkda", JSON.stringify(response.data));
          const accessToken: string = response.data.accessToken;
          const tokenData: any = jwtDecode(accessToken);

          console.log("Token value:", response.data.token);

          console.log("Decoded Token:", tokenData);

          const userId = tokenData.sub;
          const issuedAt = tokenData.iat;
          const expiration = tokenData.exp;

          const base64Url = accessToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(atob(base64));

          if (!tokenData) {
            return;
          }
          cookies.set(AUTH_TOKEN, tokenData, {
            expires: new Date(tokenData.exp * 1000),
          });
          cookies.set(AUTH_RAW_TOKEN, accessToken, {
            expires: new Date(tokenData.exp * 1000),
          });

          console.log("Success save cookies");
          // const faculty = JSON.parse(tokenData.faculty);
          // const customer = JSON.parse(tokenData.customer);

          // if (!tokenData) {
          //   return;
          // }

          // if (tokenData.type !== "student") {
          //   toast.error("request:invalid_user");
          //   return;
          // }

          // if (userId) {
          //   tokenData.userId = userId;
          // }
          // if (customer) {
          //   tokenData.customer = customer;
          // }

          router.push(ROUTES.home.index);
          //  redirect(ROUTES.home.index)
        } catch (error) {}
      },
    });
  };

  return (
    <div className="flex align-items-center justify-content-center h-full w-full p-0">
      <div className="flex flex-wrap shadow-2 w-full border-round-2xl overflow-hidden">
        <Loader show={signInMutation.isSuccess} />

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
