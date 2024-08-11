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
    maSo?:string;
    subjects?:FacultyType;
    points?:PointType

}

interface StudentParamType extends ParamType {
    isGetMajor?: boolean;
    industryId?: boolean;
    majorId?: boolean;
    maSo?:string;

}

export type { StudentType, StudentParamType };
