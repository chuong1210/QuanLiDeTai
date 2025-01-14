interface StudentType extends DefaultResponse {
    code: string;
    name: string;
    myClass: string;
    email: string;
    phoneNumber: string;
    chucVu?: string;
    departmentName?: number;
    subjectName?: string;
    subject?: SubjectType;
    points?: Ipoint[];
    POINT_INSTRUCTORS?: Ipoint;
    POINT_THESIS_ADVISOR?: Ipoint;
    POINT_COUNCIL?: Ipoint;
    POINT_AVG?: number;
    subjectId?: string;
}