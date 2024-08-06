import { cookies, http } from '@/assets/helpers';
import { StudentType } from '@/assets/interface/Students.type'
import { API } from './api';
import { headers } from 'next/headers';
import { REFRESH_TOKEN } from '../httpRequest';
import { FormStateType } from '@/assets/types/loginform';
import { AuthTypeLogin, TopicParamType, TopicType } from '@/assets/interface';
import { formChangePassword } from '@/assets/types/changePassword';
import { AxiosResponse } from 'axios';
import { ResponseType } from '@/assets/types/httpRequest';




export const loginStudent = async (user: FormStateType): Promise<ResponseType<AuthTypeLogin>> => {
  const response: AxiosResponse<ResponseType<AuthTypeLogin>> = await http.post(API.auth.sign_in, user);
  return response.data;

  //   {headers: {
//   Authorization: `Bearer ${cookies.get(REFRESH_TOKEN)}`
// }}
};

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
   await http.get<TopicType>(API.list.research)
 
  };
  
  export const fetchTopicCourses = async (topic:string, signal?: AbortSignal) => {
    await http.get<TopicType>(API.list.research+`${topic}`)

  };
  
  export const registerTopicAPI = async (data:TopicType): Promise<ResponseType>  => {
  const response: AxiosResponse<ResponseType> =  await http.post(API.post.register_research,data);

   return response.data;

  };
  export const cancelTopicAPI = async (data:TopicType): Promise<ResponseType>  => {
    const response: AxiosResponse<ResponseType> =  await http.remove(API.delete.cancel_research,data);
  
     return response.data;
  
    };

  export const updatePassword = async (passwordData: formChangePassword) => {
 await http.post(`${API.post.change_password}/`, passwordData);
   
  };


// export const updateStudent = (id: number | string, student: StudentType) => http.put<StudentType>(`students/${id}`, student)

