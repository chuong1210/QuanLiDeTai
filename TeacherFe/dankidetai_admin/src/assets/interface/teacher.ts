interface TeacherType extends DefaultResponse {
    maSo: string;
    name: string;
    email: string;
    phoneNumber: string;
    hocVi?: string[];
    chucVu?: string[];
    departmentName: string;
    subjectName: string;
}
// const a = {
//     "maSo": "222222",
//     "name": "Phan Thanh hùng",
//     "DOB": "01/01/1988",
//     "hocVi": "Thạc sĩ",
//     "email": "tranvantho123123@huit.edu.vn",
//     "phoneNumber": "09123456789",
//     "chucVu": "TRƯỞNG BỘ MÔN",
//     "user_id": "3",
//     "departmentName": "Công nghệ thông tin",
//     "subjectName": "Kỹ Thuật Phần Mềm"
// }