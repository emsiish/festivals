import { db } from '@/lib/db';
import crypto from "crypto";
import bcrypt from 'bcrypt';
const saltRounds = 10;
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Only POST requests allowed" });
        return;
    }
    const { email, password } = req.body;

    const user = await db.get("SELECT * FROM users WHERE email = ?", email);

    if(!user) {
        res.status(401).json({ message: "User not found" });
        return;
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if(!passwordValid) {
        res.status(401).json({ message: "Password invalid" });
        return;
    }

    const session = crypto.randomBytes(16).toString("base64");

    await db.run("INSERT INTO sessions (id, user_id) VALUES (?, ?)", session, user.id);

    res.setHeader("Set-Cookie", `session=${session}; HttpOnly; Path=/;`);

    res.json({});
}