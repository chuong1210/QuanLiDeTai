interface SubjectType extends DefaultResponse {
    name: string;
    department?: DepartmentType
}
interface CouncilType extends DefaultResponse {
    teacherIds: string[];
    subjectId: string;
    teacherName?: string[];
    subjectName?: string;
}

interface CouncilGetAllType extends DefaultResponse {
    createdDate: string;
    id: string
    isActivated: boolean
    modifiedDate: Date;
    subject: SubjectType;
    teachers: TeacherType[];
}