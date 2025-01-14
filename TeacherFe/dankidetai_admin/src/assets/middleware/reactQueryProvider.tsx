"use client"

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from "react";
import { toast } from "react-toastify";
export default function ProviderQuery({ children }: { children: React.ReactNode }) {

    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error: any) => {
                console.log(error)
                toast.error(error?.response?.data?.messages?.[0] || error?.message);
            },
        }),
        defaultOptions: {
            mutations: {
                onError: (error: any) => {
                    toast.error(error?.response?.data?.messages?.[0] || error?.message);
                },
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    )
}
