interface ThesisType extends DefaultResponse {
    name: string;
    minTV: number;
    maxTV: number;
    idBomon: number[];
    instructors: number[];
    details?: string;
    idThesis?: string;
    oldDetails?: string;
    Group?: any;
}
