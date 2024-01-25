import { db } from '@/lib/db';

import bcrypt from 'bcrypt';
const saltRounds = 10;
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Only POST requests allowed" });
        return;
    }
    const { email, password, role } = req.body;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    await db.run("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", [email, passwordHash, role]);

    res.json({});
}