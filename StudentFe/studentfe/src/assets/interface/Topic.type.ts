import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType } from './';
import { GroupType, MajorType, TeacherType } from '.';

interface TopicType extends GeneralType {
    summary?: string;
    minQuantity?: number;
    maxQuantity?: number;
    thesisReviewsId?: number[];
    thesisReviews?: TeacherType[];
    thesisInstructionsId?: number[];
    thesisMajorsId?: number[];
    thesisInstructions?: TeacherType[];
    thesisMajors?: MajorType[];
    lecturerThesis?: TeacherType;
    status?: 'A' | 'AR' | 'D';
    groupDto?: GroupType;
    messages?: string[];
    isRegister?: boolean;
}

interface TopicParamType extends ParamType {
    isGetIssuer?: boolean;
    isGetThesisInstructions?: boolean;
    isGetThesisReviews?: boolean;
    isGetThesisMajors?: boolean;
    departmentId?: boolean;
}

export type { TopicType, TopicParamType };
