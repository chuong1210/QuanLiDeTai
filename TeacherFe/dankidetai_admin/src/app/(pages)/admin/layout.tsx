import Header from "@/resources/components/layout/header";
import Sidebar from "@/resources/components/layout/sidebar";
import { ReactNode } from "react";
enum roleE {
    catechism = "catechism",
    mater = "marter",
    dean = "dean",
    teacher = "teacher"
}
const Layout = ({ children, mater, catechism, dean, teacher }:
    { children: ReactNode, mater: ReactNode, catechism: ReactNode, dean: ReactNode, teacher: ReactNode }) => {
    let role: roleE;
    role = roleE.mater
    const element = () => {
        switch (role) {
            case roleE.catechism: return catechism;
            case roleE.mater: return mater;
            case roleE.dean: return dean;
            case roleE.teacher: return teacher;
            default: return children
        }
    }
    return (
        <div>
            <div className='min-h-screen surface-100 overflow-hidden m-0'>
                <div >
                    <Header />
                    <div className='flex p-3 w-100 overflow-auto' style={{ marginTop: '4rem' }}>
                        <Sidebar />
                        <div className='' style={{ width: "80vw", marginLeft: "1rem" }}>
                            {element()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
