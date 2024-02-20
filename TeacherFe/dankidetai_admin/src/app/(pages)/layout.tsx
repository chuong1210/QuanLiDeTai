import { PageProps } from '@/assets/types/UI';
import Footer from '@/resources/components/layout/footer';
import Header from '@/resources/components/layout/header';
const AuthLayout = ({ children }: PageProps) => {

    return (
        < >
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default AuthLayout;
