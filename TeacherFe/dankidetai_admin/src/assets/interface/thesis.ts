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
interface Icomment {
    ID: string;
    NameTeacher: string;
    CreateAt: string;
    message: string;
}
interface ReSearchType extends DefaultResponse {
    name: string;
    code: string;
    detail: string;
    oldDetail: string;
    notes: string;
    maxMembers: number;
    minMembers: number;
    instructorsIds: string[];
    gvpb: string;
    stage: string;
    schoolYear: string;
    isApproved: number;
    teachers: TeacherType[];
    subjects: SubjectType[];
    feedbacks: Icomment[];
    status: "PA" | "AP" | "AS" | "DE"
}