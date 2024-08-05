interface JobType extends DefaultResponse {
    from: string;
    due: string;
    sendTo: string;
    sendFrom: string;
    name: string;
    details?: string;
    isCompleted: number;
}