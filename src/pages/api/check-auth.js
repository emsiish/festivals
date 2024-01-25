import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Only GET requests allowed' });
    return;
  }

  const session = req.cookies.session;

  if (!session) {
    res.status(401).json({ isAuthenticated: false });
    return;
  }

  const userSession = await db.get('SELECT * FROM sessions WHERE id = ?', session);

  if (!userSession) {
    res.status(401).json({ isAuthenticated: false });
    return;
  }

  const user = await db.get('SELECT * FROM users WHERE id = ?', userSession.user_id);

  if (!user) {
    res.status(401).json({ isAuthenticated: false });
    return;
  }


  res.status(200).json({
    isAuthenticated: true,
    user: {
      id: user.id,
      name: user.name,
    },
  });
}