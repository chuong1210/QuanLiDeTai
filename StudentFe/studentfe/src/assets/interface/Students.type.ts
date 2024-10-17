import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType, GroupType, PointType } from './';
import { FacultyType } from './Faculty';

interface StudentType extends GeneralType {
    dateOfBirth?: Date | null;
    gender?: string;
    myClass?: string;
    majorId?: string | number;
    studentJoinId?: number;
    status?: string;
    groupDto?: GroupType;
    subjects?:FacultyType;
    points?:PointType[];

}

interface StudentParamType extends ParamType {
    isGetMajor?: boolean;
    industryId?: boolean;
    majorId?: boolean;

}

export type { StudentType, StudentParamType };
