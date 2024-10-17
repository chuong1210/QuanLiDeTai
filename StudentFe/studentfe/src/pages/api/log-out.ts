import { NextApiRequest, NextApiResponse } from 'next';
import { API, ROUTES } from '@/assets/config'; // Đường dẫn API

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Lấy token từ cookie hoặc body của request
  const { token } = req.body || req.cookies.accessToken;

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  try {
    // Gọi API logout từ backend
    const response = await fetch(`${ROUTES.base}${API.auth.sign_out}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) throw new Error('Failed to sign out');

    // Xóa cookie khi đăng xuất thành công
    res.setHeader('Set-Cookie', [
      'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);

    return res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Error in API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
