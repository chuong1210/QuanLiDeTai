import { FacultyType } from '@assets/interface';
import { MouseEvent } from 'react';
import { OptionType } from './common';

interface ConfirmModalRefType {
    show: (event: MouseEvent, data: any, message: string) => void;
    result: boolean;
}

interface ConfirmModalType {
    agreeLabel?: string;
    cancelLabel?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    onAccept?: (data: any) => void;
    onReject?: () => void;
}
// types/modal.ts

 interface ChangePasswordModalRefType {
    showModal: () => void;
    resetModal:()=>void
    hideModal:()=>void
  }
  
   interface ChangePasswordModalType {
    onSave: (data: formChangePassword) => void;
    onCancel: () => void;
    username:string;
  }
interface SelectObjectModalRefType {
    show: (items: OptionType[], defaultIndex?: number) => void;
}

interface SelectObjectModalType{
    title: string;
    onConfirm: (data: OptionType) => void;
}

interface SelectFacultyModalRefType {
    show: (selected?: FacultyType) => void;
}

interface SelectFacultyModalType  {
    onConfirm: (data: FacultyType | undefined) => void;
}
interface NotificationCardModalRefType {
    showModal: () => void;
    resetModal:()=>void    
}
export type {
    ConfirmModalRefType,
    ConfirmModalType,
    SelectObjectModalRefType,
    SelectObjectModalType,
    SelectFacultyModalRefType,
    SelectFacultyModalType,
    ChangePasswordModalRefType,
    ChangePasswordModalType,
    NotificationCardModalRefType

};
