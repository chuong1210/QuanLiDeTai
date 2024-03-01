import { ImageProps } from 'primereact/image';
import { ReactNode } from 'react';
// export interface PageProps {
//     params?: any
//     searchParams?: any
//   }
interface PageProps {
    params: {
        // lng: string;
        [key: string]: any;
    };
    searchParams?: any;
    children?: ReactNode;
    session:never
}

interface BreadcrumbProps {
    label: string;
    url: string;
    icon?: string;
}

interface LoaderProps {
    label?: string;
    show?: boolean;
    duration?:number //tu them
}

interface DividerProps {
    height?: number;
    color?: string;
    mx?: number;
    my?: number;
    px?: number;
    py?: number;
}

interface CustomImageProps extends ImageProps {}

export type { PageProps, BreadcrumbProps, LoaderProps, DividerProps, CustomImageProps };
