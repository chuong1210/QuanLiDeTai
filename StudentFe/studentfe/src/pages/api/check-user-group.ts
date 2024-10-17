// pages/api/check-user-group.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { API, ROUTES } from '@/assets/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { refreshToken } = req.body; // Access token from the request body 
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is missing' });
  }

  try {
    const response = await fetch(`${ROUTES.base}${API.detail.group}`, {
        
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch user group');

    const userData = await response.json();
    const hasGroup = !!userData?.result; // Convert to boolean

    return res.status(200).json({ hasGroup });
  } catch (error) {
    console.error('Error in API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
