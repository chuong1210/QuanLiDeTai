import { API } from '@/assets/config';
import { detail, list } from '@/assets/config/keys';
import { ParamType, ResponseType } from '@/assets/types/httpRequest';
import { useQueries, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useEffect } from 'react';
import { http } from '../helpers';

interface UseGetType<TParam, TData> {
    params?: TParam;
    enabled?: boolean;
    _onSuccess?: (_data: ResponseType<TData>) => void;
}

interface UseGetListType<TParam, TData> extends UseGetType<TParam, TData> {
    module: keyof typeof API.list;
}

interface UseGetDetailType<TParam, TData> extends UseGetType<TParam, TData> {
    module: keyof typeof API.detail;
}

interface useGetListMultiType<TParam, TData> extends UseGetType<TParam, TData> {
    module: keyof typeof API.list;
    data: TData[];
}

const useGetList = <TQueryFnData, TParam = ParamType>({
    module,
    params,
    enabled = true,
    _onSuccess = () => {},
}: UseGetListType<TParam, TQueryFnData[]>) => {
    const query = useQuery<ResponseType<TQueryFnData[]>, AxiosError<ResponseType>>({
        enabled,
        refetchOnWindowFocus: false,
        queryKey: [...list(params)[module], params],
        queryFn: async () => {
            const response = await http.get<TQueryFnData[]>(API.list[module], { params });

            return response.data;
        },
    });
    const onSuccess = useCallback(() => {
        if (query.data) {
            _onSuccess(query.data);
        }
    }, [_onSuccess, query.data]);

    useEffect(() => {
        onSuccess();
    }, [onSuccess, query.data]);

    return { ...query, response: query.data };
};

const useGetDetail = <TQueryFnData, TParam = ParamType>({
    module,
    params,
    enabled = true,
    _onSuccess = () => {},
}: UseGetDetailType<TParam, TQueryFnData>) => {
    const query = useQuery<ResponseType<TQueryFnData>, AxiosError<ResponseType>>({
        enabled,
        refetchOnWindowFocus: false,
        queryKey: [...detail()[module], params],
        queryFn: async () => {
            const response = await http.get<TQueryFnData>(API.detail[module], { params });

            return response.data;
        },
    });

    const onSuccess = useCallback(() => {
        if (query.data) {
            _onSuccess(query.data);
        }
    }, [_onSuccess, query.data]);

    useEffect(() => {
        onSuccess();
    }, [onSuccess, query.data]);

    return { ...query, onSuccess, response: query.data };
};

const useGetListMulti = <TData, TQueryFnData, TParam = ParamType>({
    data,
    params,
    module,
    _onSuccess = () => {},
}: useGetListMultiType<TParam, TData>) => {
    const query = useQueries({
        queries: data.map((t) => ({
            queryKey: [...list(params)[module], params, data],
            queryFn: async () => {
                const response = await http.get<TQueryFnData[]>(API.list[module], {
                    params: {},
                });

                return response.data.data || [];
            },
        })),
        combine: (results) => {
            return {
                data: results.map((result) => result.data).filter(Boolean),
                isFetching: results.some((result) => result.isFetching),
                isLoading: results.some((result) => result.isLoading),
            };
        },
    });

    // const onSuccess = useCallback(() => {
    //     if (query.data) {
    //         _onSuccess(query.data);
    //     }
    // }, [_onSuccess, query.data]);

    // useEffect(() => {
    //     onSuccess();
    // }, [onSuccess, query.data]);

    return { ...query };
};

export { useGetDetail, useGetList, useGetListMulti };
