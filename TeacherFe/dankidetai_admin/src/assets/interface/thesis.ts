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
interface ReSearchType extends DefaultResponse {
    name: string;
    maDeTai: string;
    detail: string;
    oldDetail: string;
    notes: string;
    maxMembers: number;
    minMembers: number;
    gvhd: string;
    gvpb: string;
    dotDangKy: string;
    namHoc: string;
    isApproved: number;
    teachers: TeacherType[];
    subjects: SubjectType[];
    feedbacks: any[];
}