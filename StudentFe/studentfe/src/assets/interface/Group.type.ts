import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType, StudentType, TopicType } from './';

interface GroupType extends GeneralType {
    countMember?: string | number;
    leaderId?: string | number;
    leader?: any;
    members?: {
        student?: StudentType;
    }[];
    thesisDto?: TopicType;
}

interface GroupParamType extends ParamType {
    isGetLeader?: boolean;
    isGetGroupMe?: boolean;
    isGetGroupMeCurrent?: boolean;
    isGetMember?: boolean;
    isGetThesis?: boolean;
}

export type { GroupParamType, GroupType };
