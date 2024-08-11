// pages/api/students.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const students = [
  { id: 1, name: 'John Doe', email: 'john@example.com', course: 'Mathematics' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', course: 'Physics' },
  // Add more students as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(students);
}
