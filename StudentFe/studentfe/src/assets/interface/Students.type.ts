import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType, GroupType } from './';

interface StudentType extends GeneralType {
    dateOfBirth?: Date | null;
    gender?: string;
    class?: string;
    majorId?: string | number;
    studentJoinId?: number;
    status?: string;
    groupDto?: GroupType;

}

interface StudentParamType extends ParamType {
    isGetMajor?: boolean;
    industryId?: boolean;
    majorId?: boolean;
}

export type { StudentType, StudentParamType };
