import { MetaType } from '@/assets/types/httpRequest';
interface MetaType {
    currentPage?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    messages?: string[];
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
}

interface ParamType {
    id?: string | number;
    filters?: string;
    sorts?: string;
    page?: number;
    limit?: number;
    isAllDetail?: boolean;
    facultyId?: string | number;
    isGetFaculty?: boolean;
    removeFacultyId?: boolean;
    limit?: number;
    orderBy?:string;
    orderDirection?:"ASC"|"DESC";
}


 interface ResponseType<T=any> {
    code: number;
    message?: string;
    result: T |null;
    //extra?: MetaType;
    messages: string[] | null;
    message: string | null;
    exception: string | null;
    succeeded?: boolean;

  }
  
 interface MetaResponseType<T=any> extends MetaType {
  totalPages?: number;
  responses?:any
  totalElements?:number;

}

  
  
 
  
 
  
   interface IntrospectTokenResponse {
    isAuthenticated: boolean;
  }
export type { MetaType, ParamType, ResponseType,MetaResponseType };
