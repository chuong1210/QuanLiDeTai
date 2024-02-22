import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType } from './';

interface TeacherType extends GeneralType {
    departmentId?: number | string;
    gender?: string;
    dateOfBirth: Date | null;
    academicTitle?: string;
    degree?: string;
    type?: string;
}

interface TeacherParamType extends ParamType {
    type?: string;
    departmentId?: string | number;
}

export type { TeacherType, TeacherParamType };
