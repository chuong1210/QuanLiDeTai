// file này lưu tất cả các đưuòng dẫn api
const API = {
    base: "http://localhost:8888",
    department: {
        insert: "/departments/insert",
        update: "/departments/update",
        delete: "/departments/delete",
        getAll: "/departments/showAll"
    },
    subjects: {
        insert: "/subjects/insert",
        update: "/subjects/update",
        delete: "/subjects/delete",
        getAll: "/subjects/showAll"
    },
    students: {
        insert_from_excel: "/students/insert-from-excel",
        insert: "/students/insert",
        update: "/students/update",
        delete: "/students/delete",
        getAll: "/students/showAll"
    },
    teachers: {
        insert: "/teachers/insert",
        delete: "/teachers/delete",
        update: "/teachers/update",
        getAll: "/teachers/showAll"
    }

}
export default API