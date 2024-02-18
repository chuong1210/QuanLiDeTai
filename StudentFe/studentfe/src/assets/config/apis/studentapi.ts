import http from '../../helpers/http'
import { StudentType } from '@/assets/interface/Students.type'
export const getStudents = (page: number | string, limit: number | string, signal?: AbortSignal) =>
  http.get<StudentType>('students', {
    params: {
      _page: page,
      _limit: limit
    },
    signal // để cancle phía axios
  })

export const getStudent = (id: number | string) => http.get<StudentType>(`students/${id}`)

export const addStudent = (student: Omit<StudentType, 'id'>) => http.post<StudentType>('/students', student)

export const updateStudent = (id: number | string, student: StudentType) => http.put<StudentType>(`students/${id}`, student)

export const deleteStudent = (id: number | string) => http.delete<{}>(`students/${id}`)
