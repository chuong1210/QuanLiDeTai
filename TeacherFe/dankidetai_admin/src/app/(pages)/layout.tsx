import AuthRouter from '@/assets/middleware/authRouter';
import { PageProps } from '@/assets/types/UI';
import Sidebar from '@/resources/components/layout/sidebar';
import Header from '@/resources/components/layout/header';
const AuthLayout = ({ children }: PageProps) => {

    return (
        < >
            {children}
        </>
    );
};

export default AuthLayout;
