import { cookies, http } from '@/assets/helpers';
import { StudentType } from '@/assets/interface/Students.type'
import { API } from './api';
import { headers } from 'next/headers';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../httpRequest';
import { FormStateType } from '@/assets/types/loginform';
import { AuthTypeLogin, AuthTypeRefreshToken, TopicParamType, TopicType } from '@/assets/interface';
import { formChangePassword } from '@/assets/types/changePassword';
import axios, { AxiosResponse } from 'axios';
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

  export const registerGroup = async (studentJoinId:string[] | string) => {
    await http.post(`${API.post.register_group}`, 
      {
        studentId:studentJoinId
      }
    );
      
     };
   
  
  export const refreshTokenApi = async (oldTokendata?:AuthTypeRefreshToken): Promise<ResponseType<AuthTypeLogin> | null> => {
      const refreshToken = cookies.get(ACCESS_TOKEN);
      console.log("refreshToken"+refreshToken)
      if (!refreshToken) {
        return null; // Or throw an error if refresh token is missing
      }
  
      const response = await http.post(API.auth.refresh, {
        token: refreshToken,
      });
      // const response = await http.post(API.auth.refresh, oldTokendata);
      // console.log(response.data)
      return response.data;

      
    } 

// export const updateStudent = (id: number | string, student: StudentType) => http.put<StudentType>(`students/${id}`, student)

