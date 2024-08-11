// pages/api/refresh-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { API } from '@/assets/config';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { token } = req.body;

    const response = await axios.post(`${API.auth.refresh}`, { token }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const newAccessToken = response.data.result?.accessToken;

    // Cài đặt cookie mới trên server-side
    res.setHeader('Set-Cookie', `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=3600`);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};
