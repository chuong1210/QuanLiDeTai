interface MetaType {
    currentPage: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    messages?: string[];
    limit: number;
    totalCount?: number;
    totalPages: number;
}
interface ParamType {
    page: number,
    limit: number,
    orderBy: string,
    orderDirection: string
}

interface ResponseType<dataType = any> {
    result: {
        responses: dataType,
        page?: number,
        totalPages?: number,
        message?: string,
    }
    code: number;
}

export type { MetaType, ParamType, ResponseType };
