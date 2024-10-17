// interface PointsType extends DefaultResponse {
//     type: "gvhd" | "gvpb" | "hd";
//     scores: number;
//     msgv: string;
// }
interface ItypePoint {
    id: string,
    name: string
}
interface Ipoint {
    id: string,
    point: number,
    teacherId: string,
    typePoint: ItypePoint

}

interface Group {
    id: string;
    jobGroups: JobAll[];  // Bạn có thể thay đổi thành kiểu cụ thể nếu biết cấu trúc của jobGroups
    leaderId: string;
    students: StudentType[];
}