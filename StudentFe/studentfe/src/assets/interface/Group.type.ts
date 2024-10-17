import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType, PointType, StudentType, TeacherType, TopicType } from './';

interface GroupType extends GeneralType {
    countMember?: string | number;
    leaderId?: string | number;
    members?: {
        student?: StudentType;
    }[];
    students?: StudentType[];
    thesisDto?: TopicType;
    teacher?: TeacherType;
}

interface GroupParamType extends ParamType {
    isGetLeader?: boolean;
    isGetGroupMe?: boolean;
    isGetGroupMeCurrent?: boolean;
    isGetMember?: boolean;
    isGetThesis?: boolean;
}

export type { GroupParamType, GroupType };
