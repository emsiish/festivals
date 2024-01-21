import { db } from '@/lib/db';

function getCurrentUser(req) {
    const { session } = req.cookies;
    if (!session) {
        return null;
    }
    return db.get("SELECT users.id, users.email FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = ?", session);
}
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Only POST requests allowed" });
        return;
    }
    const { title, description, date, price } = req.body;

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (title.startsWith("x")) {
        res.status(400).json({
            message: "Title cannot start with x",
        })
    }

    const { lastID } = await db.run("INSERT INTO events (title, description, date, price) VALUES (?, ?, ?, ?)", [title, description + "created by " + currentUser.email, date, price]);

    const event = await db.get("SELECT * FROM events WHERE id = ?", lastID);

    res.json(event);
}