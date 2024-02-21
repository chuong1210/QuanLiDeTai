import { cookies, http } from '@/assets/helpers';
import { StudentType } from '@/assets/interface/Students.type'
import { API } from './api';
import { headers } from 'next/headers';
import { AUTH_RAW_TOKEN } from '../httpRequest';


export const loginStudent = (user: FormStateType) => http.post(API.auth.sign_in,user, 
//   {headers: {
//   Authorization: `Bearer ${cookies.get(AUTH_RAW_TOKEN)}`
// }}
);
// export const getStudents = (page: number | string, limit: number | string, signal?: AbortSignal) =>
//   http.get<StudentType>('students', {
//     params: {
//       _page: page,
//       _limit: limit
//     },
//     signal // để cancle phía axios
//   })




// export const updateStudent = (id: number | string, student: StudentType) => http.put<StudentType>(`students/${id}`, student)

