import { ReactNode } from "react";

const Layout = ({ children, mater }: { children: ReactNode, mater: ReactNode }) => {
    return (
        <div>
            {true ? mater : children}

        </div>
    );
};

export default Layout;
