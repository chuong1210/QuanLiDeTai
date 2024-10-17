interface FormStateType {
    username: string;
    password: string;
  }
  
interface formChangePassword extends Omit<FormStateType, 'username'> {
  newPassword: string;
  confirmPassword: string;
}

  interface LoginProps {
    // control: any; // Điều này phụ thuộc vào loại control bạn đang sử dụng
    onSubmit: SubmitHandler<FormStateType>;
    formStateUser: FormStateType;
    handleChange: (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    signInMutation: any; // Điều này phụ thuộc vào loại mutation bạn đang sử dụng
  }
  

  export { FormStateType, LoginProps,formChangePassword };