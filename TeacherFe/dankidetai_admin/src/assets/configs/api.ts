import { m } from "framer-motion"

// file này lưu tất cả các đưuòng dẫn api
const API = {
    base: "http://localhost:8888",
    role: {
        showAlNoParams: "/roles/showAll-no-params"
        // getAllNoParams:""
    },
    department: {
        insert: "/departments/insert",
        update: "/departments/update",
        delete: "/departments/delete",
        getAll: "/departments/showAll",
        getAllNoParams: "/departments/showAll-no-params"
        // getAllNoParams:""
    },
    subjects: {
        insert: "/subjects/insert",
        update: "/subjects/update",
        delete: "/subjects/delete",
        getAll: "/subjects/showAll",
        getAllNoParams: "/subjects/showAll-no-params"
    },
    councils: {
        insert: "/councils/insert",
        update: "/councils/update",
        delete: "/councils/delete",
        getAll: "/councils/showAll",
    },
    systemenv: {
        update: "/system-variables/update",
        getAll: "/system-variables/showAll-no-params",
    },
    students: {
        insert_from_excel: "/students/insert-from-file",
        insert: "/students/insert",
        update: "/students/update",
        delete: "/students/delete",
        getAll: "/students/showAll",
        getAllNoParams: "/students/showAll-no-params"
    },
    teachers: {
        insert_from_excel: "/teachers/insert-from-file",
        insert: "/teachers/insert",
        delete: "/teachers/delete",
        update: "/teachers/update",
        getAll: "/teachers/showAll",
        getAllNoParams: "/teachers/showAll-to-selection",
        // lay truong bo mon
        showAllHeadOfDepartment: "/teachers/showAll-head-of-department",
        // lay chung bo mon
        showAllToSelection: "/teachers/showAll-to-selection?theSameSubject=true",
    },
    job: {
        InsertJobForTeacher: "/job-teacher/insert",
        UpdateJobForTeacher: "/job-teacher/update/",
        ShowMyJob: "/job-teacher/showMyJob-no-params",
        ShowJobDetail: "/job-teacher/showJob-detail?jobId=",
        ShowMyJobDelivered: "/job-teacher/showMyJob-delivered",

        InsertJobForStudent: "/job-group/insert",
        UpdateJobForStudent: "/job-group/update/",
        CommitJobForStudent: "/job-group/mark-completed/",
        RemoveJobForStudent: "/job-group/delete",
    },
    reSearch: {
        insert: "/researches/insert-from-file",
        update: "/researches/update",
        mark_approved: "/researches/mark-approved",
        delete: "/researches/delete",
        showall_to_approve: "/researches/showAll-to-approval-processing",
        showall_my_research: "/researches/showAll-my-research",
        showall_to_feedback: "/researches/showAll-to-feedback",
        showDetail: "/researches/showOne?researchId=",
        showone: "/researches/showOne?researchId=",
        showAll: "/researches/showAll",
    },
    feedBack: {
        insert: "/feedbacks/insert",
        update: "/feedbacks/update/6c93d1f3-e63b-4290-b178-b8a09485b042",
        delete: "/feedbacks/delete",
    },
    auth: {
        login: "/auth/log-in",
        logout: "/auth/log-out",
        refresh: "/auth/refresh"
    },
    point: {
        insert: "/points/insert",
        update: "/points/update/"
    }

}
export default API