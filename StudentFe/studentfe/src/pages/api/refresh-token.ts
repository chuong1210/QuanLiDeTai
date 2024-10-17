// pages/api/refresh-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { API, ROUTES } from '@/assets/config';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body; // Access the token from the request body

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const refreshTokenResponse = await fetch(`${ROUTES.base}${API.auth.refresh}`, {
      method: 'POST', // Important: Specify POST method
      headers: {
        'Content-Type': 'application/json',
        // Include any other necessary headers
      },
      body: JSON.stringify({ refreshToken: token }), // Correctly format the body
      credentials: 'include', // Crucial for cookies
    });

    if (!refreshTokenResponse.ok) {
      const errorData = await refreshTokenResponse.json();
      return res.status(refreshTokenResponse.status).json({ error: errorData.error || 'Refresh token failed' });
    }

    const refreshTokenResult = await refreshTokenResponse.json();
    const newAccessToken = refreshTokenResult?.result?.accessToken;

    if (!newAccessToken) {
      return res.status(400).json({ error: 'Invalid refresh token response' });
    }

    // Set the cookie with correct parameters.  Crucially, use `res.setHeader` for cookies.
    res.setHeader(
      'Set-Cookie',
      `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=${
        refreshTokenResult?.result?.accessTokenExpiresIn || 3600 // Default max age
      }; SameSite=Lax` // Important for security.
    );

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Server error' });
  }
};