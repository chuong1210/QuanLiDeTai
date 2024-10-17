

interface JobTeacherDetail {
    isCompleted: number;
    quantityCompleted: number;
    teacher: Teacher;
}



interface JobType extends DefaultResponse {
    description: string;
    detail: string;
    due: string; // ISO 8601 date string
    from: string; // ISO 8601 date string
    id: string;
    jobTeacherDetails: JobTeacherDetail[];
    name: string;
    quantityRequirement: number;
    senderCode: string;
    senderName: string;
}
interface JobAll extends DefaultResponse {
    name: string
}