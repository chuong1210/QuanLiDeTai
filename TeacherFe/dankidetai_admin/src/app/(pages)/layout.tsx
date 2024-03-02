import AuthRouter from '@/assets/middleware/authRouter';
import { PageProps } from '@/assets/types/UI';
import Sidebar from '@/resources/components/layout/sidebar';
import Header from '@/resources/components/layout/header';
const AuthLayout = ({ children }: PageProps) => {

    return (
        < >
            <AuthRouter>
                <div className='min-h-screen surface-100 overflow-hidden m-0'>
                    <div className='flex'>
                        <Sidebar />

                        <div style={{ width: 'calc(100vw - 19rem)' }}>
                            <Header />

                            <div className='p-3 overflow-auto' style={{ height: 'calc(100vh - 4rem)', marginTop: '4rem' }}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthRouter>
        </>
    );
};

export default AuthLayout;
