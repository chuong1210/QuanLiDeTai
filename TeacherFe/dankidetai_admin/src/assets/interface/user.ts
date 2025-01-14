interface Role {
    id: string;
    name: string;
    code: string;
}

interface Teacher {
    id: string;
    // maSo: string;
    name: string;
    hocVi: string;
    email: string;
    phoneNumber: string;
    chucVu: string;
    code: string;
}

interface UserLoginType {
    id: string;
    username: string;
    isGraduate: number;
    roles: Role[];
    teacher: Teacher;
}