// file này lưu tất cả các đưuòng dẫn api
const API = {
    base: "http://localhost:8888",
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
    students: {
        insert_from_excel: "/students/insert-from-excel",
        insert: "/students/insert",
        update: "/students/update",
        delete: "/students/delete",
        getAll: "/students/showAll",
        getAllNoParams: "/students/showAll-no-params"
    },
    teachers: {
        insert_from_excel: "/teachers/insert-from-excel",
        insert: "/teachers/insert",
        delete: "/teachers/delete",
        update: "/teachers/update",
        getAll: "/teachers/showAll",
        getAllNoParams: "/teachers/showAll-no-params"
    },
    job: {
        InsertJobForTeacher: "/jobs/teacher-job/insert",
        ShowAllJobOfTeacher: "/jobs/teacher-job/show-job-not-complete?maSo=1111",
        DeleteJobForTeacher: "/jobs/teacher-job/delete",
        ShowAllNoParam: "/jobs/showAll-no-params",
    },
    reSearch: {
        insert: "/researches/insert",
        update: "/researches/update",
        delete: "/researches/delete",
        showall: "/researches/showAll",
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
    }

}
export default API