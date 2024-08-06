import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType } from './';
import { GroupType, MajorType, TeacherType } from '.';
import { FeedbackType } from './Feedback.type';

interface TopicType extends GeneralType {
    // summary?: string;
    // minQuantity?: number;
    // maxQuantity?: number;
    // thesisReviewsId?: number[];
    // thesisReviews?: TeacherType[];
    // thesisInstructionsId?: number[];
    // thesisMajorsId?: number[];
    // thesisInstructions?: TeacherType[];
    // thesisMajors?: MajorType[];
    // lecturerThesis?: TeacherType;
    // status?: 'A' | 'AR' | 'D';
    // groupDto?: GroupType;
    // messages?: string[];
    // isRegister?: boolean;
    // description?:string;
        researchID?:number
        maDeTai?: string;
        detail?: string;
        oldDetail?: string;
        notes?: string;
        maxMembers?: number;
        minMembers?: number;
        gvhd?: string;
        gvpb?: string;
        dotDangKy?: string;
        namHoc?: string;
        isApproved?: number;
        isRegister?: boolean;
        teachers?: TeacherType[];
        subjects?: MajorType[];
        feedbacks?: FeedbackType[];
        groups?: GroupType;
}

// * **'A'**:  Active or Available. This could mean the topic is open for students to choose.
// * **'AR'**:  Assigned or Reserved. This could mean the topic has been assigned to a specific student or group.
// * **'D'**:  Deleted or Discontinued. This could mean the topic is no longer available for selection.
interface TopicParamType extends ParamType {
    isGetIssuer?: boolean;
    isGetThesisInstructions?: boolean;
    isGetThesisReviews?: boolean;
    isGetThesisMajors?: boolean;
    departmentId?: boolean;
}

export type { TopicType, TopicParamType };
