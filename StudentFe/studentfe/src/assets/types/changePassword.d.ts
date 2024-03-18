import { FormStateType } from "./loginform";

interface formChangePassword extends Omit<FormStateType, 'username'> {
    newPassword: string;
    confirmPassword: string;
}

export {formChangePassword}