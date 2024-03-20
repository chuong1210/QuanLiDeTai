interface InfomationType extends DefaultResponse {
    name: string;
    msgv: string;
    hovi?: string;
    email?: string;
    phoneNumber?: string;
    chucVu?: string;
    departMent: DepartmentType;
    subject: SubjectType;
}