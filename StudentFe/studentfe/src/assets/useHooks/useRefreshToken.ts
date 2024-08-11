 // Assuming you have this utility

 import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config';
import { cookies } from '../helpers';
 import { http } from "../helpers";

const refreshToken = async () => {
  try {
    const response = await http.post('/api/refresh-token', {
      token: cookies.get(REFRESH_TOKEN), // Assuming you store refresh token in cookies
    });

    if (response.status===100) {
      console.log('Token refreshed successfully');
    }
  } catch (error) {
    console.error('Failed to refresh token', error);
  }
};

export default refreshToken;
