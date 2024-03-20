interface FeedbackType extends DefaultResponse {
    sendTo: string;
    sendFrom: string;
    isRead: boolean;
    message: string;
}