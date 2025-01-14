interface ThesisType extends DefaultResponse {
    name: string;
    minTV: number;
    maxTV: number;
    idBomon: number[];
    instructors: number[];
    details?: string;
    idThesis?: string;
    oldDetails?: string;
    Group?: any;
}
interface Icomment extends DefaultResponse {
    message: string;
    createdBy: string;
    createdDate: string;
    senderName: string;
    senderCode: string;

}
// 

interface ReSearchType extends DefaultResponse {
    name: string;
    code: string;
    detail: string;
    oldDetail: string;
    notes: string;
    maxMembers: number;
    minMembers: number;
    stage: string;
    schoolYear: string;
    isApproved: number;
    teachers?: TeacherType[];
    subject: SubjectType;
    feedbacks: Icomment[];
    status: "PA" | "AP" | "AS" | "DE"
    group?: Group;
    researchTeachers?: {
        teacher: TeacherType,
        typeTeacher: { name: string }
    }[];
    exitAdvisor?: boolean;
    exitCoucli?: boolean;
    donePoint?: boolean;
    differencePoint?: boolean;
}