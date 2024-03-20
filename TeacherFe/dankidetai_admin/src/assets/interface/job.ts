interface JobType extends DefaultResponse {
    from: string;
    due: string;
    sendTo: string;
    name: string;
    isComplete: boolean;
    detail?: string;
}