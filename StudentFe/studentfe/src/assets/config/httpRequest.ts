import { MetaType, ParamType } from '@/assets/types/httpRequest';
import moment from 'moment';

// const AUTH_TOKEN = 'auth_token';
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN='refresh_token';
const DATA_RESULT='data_result';
const TOKEN_EXPIRE = moment().add({ minute: 600 }).toDate().getMinutes();
const ROWS_PER_PAGE = [10, 20, 30];

const DEFAULT_META: MetaType = {
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    messages: [],
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
};

const DEFAULT_PARAMS: ParamType = {
    page: 1,
    limit: 10,
   // sorts: '-DateCreated',
   orderBy:'id',
   orderDirection:"ASC"
};

export { ACCESS_TOKEN, TOKEN_EXPIRE, ROWS_PER_PAGE, DEFAULT_META, REFRESH_TOKEN, DATA_RESULT, DEFAULT_PARAMS };
