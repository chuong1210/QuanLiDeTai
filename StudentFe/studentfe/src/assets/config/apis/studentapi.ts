import { cookies, http } from '@/assets/helpers';
import { StudentType } from '@/assets/interface/Students.type'
import { API } from './api';
import { headers } from 'next/headers';
import { REFRESH_TOKEN } from '../httpRequest';
import { FormStateType } from '@/assets/types/loginform';
import { TopicParamType, TopicType } from '@/assets/interface';
import { formChangePassword } from '@/assets/types/changePassword';


export const loginStudent = (user: FormStateType) => http.post(API.auth.sign_in,user, 
//   {headers: {
//   Authorization: `Bearer ${cookies.get(REFRESH_TOKEN)}`
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

// courseApi.js
export const fetchAllCourses = async () => {
   await http.get<TopicType>(API.list.register_topic)
 
  };
  
  export const fetchTopicCourses = async (topic:string, signal?: AbortSignal) => {
    await http.get<TopicType>(API.list.register_topic+`${topic}`)

  };
  
  export const registerCourseAPI = async (courseId:string,data:TopicType) => {
    await http.post(API.post.register_topic+`${courseId}`,data)

  };
  

  export const updatePassword = async (passwordData: formChangePassword) => {
 await http.post(`${API.post.change_password}/`, passwordData);
   
  };


// export const updateStudent = (id: number | string, student: StudentType) => http.put<StudentType>(`students/${id}`, student)

