// router trong trang web client
const ROUTER = {
    auth: {
        login: "/auth/auth-login"
    },
    admin: {
        //giaovu: "/admin/giaovu",
        info: "/admin/info"
    },
    home: "/admin",
    master: {
        department: "/admin/department",
        subject: "/admin/subject"
    },
    catechism: {
        students: "/admin/studentList",
        teachers: "/admin/teacherList"
    },
    dean: {
        giveJobForTeacher: "/admin/truongkhoa",
    }
}
export default ROUTER