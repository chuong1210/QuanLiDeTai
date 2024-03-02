import { MenuItemType } from '@/assets/types/menu';

import { FaArrowRightArrowLeft, FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';
import { LuLanguages } from 'react-icons/lu';

const SIDEBAR_MENU = (): MenuItemType[] => {

    return [
        {
            code: 'info',
            parent: 'info',
            label: t('menu:info'),
            icon: <FaUser />,
            to: `/${lng}${pathName}`,
        },
        {
            code: lng || 'language',
            parent: lng || 'language',
            label: currLanguage,
            icon: <LuLanguages />,
            items: LANGUAGES.map((t) => ({
                ...t,
                parent: 'language',
                to: `/${t.code}${pathName}`,
            })),
        },
        {
            code: 'logout',
            parent: 'logout',
            label: t('menu:logout'),
            icon: <FaArrowRightFromBracket />,
            to: `/${lng}${ROUTES.auth.sign_in}`,
        },
        {
            code: 'change_faculty',
            parent: 'change_faculty',
            label: t('menu:change_faculty'),
            icon: <FaArrowRightArrowLeft />,
            checkPermission: false,
        },
    ];
};

export { SIDEBAR_MENU };
