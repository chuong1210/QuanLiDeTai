// pages/api/check-user-group.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { API, ROUTES } from '@/assets/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const authHeader = req.headers['authorization']; // Get the Authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ error: 'Access token is missing' });
    }
  
    // Extract the token from the header
    const accessToken = authHeader.split(' ')[1];
  try {
    const response = await fetch(`${ROUTES.base}${API.detail.student}`, {
        
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch user group');

    const studentData = await response.json();

    return res.status(200).json({ studentData });
  } catch (error) {
    console.error('Error in API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
