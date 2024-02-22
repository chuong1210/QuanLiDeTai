import { ACTION, AUTH_TOKEN } from '@/assets/config';
import useCookies from './useCookies';
import { AuthType } from '@/assets/interface/AuthType.type';
import { useEffect, useState } from 'react';
import { PermissionType } from '../interface/Permission.type';



const initialState: PermissionType = {
    view: false,
    update: false,
    create: false,
    change: false,
    remove: false,
};

const usePermission = (module: string): PermissionType => {
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);
    const [permission, setPermission] = useState<PermissionType>(initialState);

    useEffect(() => {
        const modulePermission = auth?.permission.filter((t) => t.startsWith(module));
        const result = initialState;

        modulePermission?.forEach((t) => {
            if (t.endsWith(ACTION.view)) {
                result.view = true;
            }

            if (t.endsWith(ACTION.change)) {
                result.change = true;
            }

            if (t.endsWith(ACTION.update)) {
                result.update = true;
            }

            if (t.endsWith(ACTION.create)) {
                result.create = true;
            }

            if (t.endsWith(ACTION.remove)) {
                result.remove = true;
            }
        });

        setPermission(result);
    }, [auth, module]);

    return permission;
};

export default usePermission;
