import { LoginProps } from "@/assets/types/loginform";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "./InputText";
import { FormStateType } from "@/assets/types/loginform";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Password } from "./Password";
import { FloatLabel } from "primereact/floatlabel";

const schema = yup.object({
  userName: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
  remember_password: yup.boolean(),
});
const LoginForm = (props: LoginProps) => {
  const { formStateUser, handleChange, signInMutation, onSubmit } = props;
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="w-full lg:w-6 p-4 lg:p-7 surface-card">
      <div className="flex align-items-center justify-content-center mb-7">
        <span className="text-2xl font-medium text-900">
          Đăng nhập để tiếp tục
        </span>
      </div>
      <form
        className="flex flex-column gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="userName"
          control={control}
          render={({ field, formState }) => (
            <FloatLabel>
              <InputText
                id="account"
                // label="Tài khoản"
                placeholder={"Tài khoản"}
                errorMessage={formState.errors.userName?.message}
                value={formStateUser.username}
                onChange={(e) => {
                  field.onChange(e);
                  handleChange("username")(e);
                }}
                onBlur={field.onBlur}
              />{" "}
              <label htmlFor="account">Username</label>
            </FloatLabel>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, formState }) => (
            <FloatLabel>
              <Password
                id="password"
                placeholder={"Mật khẩu"}
                errorMessage={formState.errors.password?.message}
                value={formStateUser.password}
                onChange={(e) => {
                  field.onChange(e);
                  handleChange("password")(e);
                }}
                onBlur={field.onBlur}
              />
              <label htmlFor="password">Password</label>
            </FloatLabel>
          )}
        />

        <div className="flex align-items-center justify-content-between">
          <div>
            {signInMutation.isError && (
              <small className="p-error">Đăng nhập thất bại</small>
            )}
          </div>
          <a className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150">
            {"Quên mật khẩu"}
          </a>
        </div>

        <Button
          label={"Đăng nhập"}
          className="w-full font-medium py-3 "
          rounded={true}
        />
      </form>
    </div>
  );
};

export default LoginForm;
