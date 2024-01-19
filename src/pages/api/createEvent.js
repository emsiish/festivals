import { db } from '@/lib/db';
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Only POST requests allowed" });
        return;
    }
    const { title, description, date, price } = req.body;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (title.startsWith("x")) {
        res.status(400).json({
            message: "Title cannot start with x",
        })
    }

    const { lastID } = await db.run("INSERT INTO events (title, description, date, price) VALUES (?, ?, ?, ?)", [title, description, date, price]);

    const event = await db.get("SELECT * FROM events WHERE id = ?", lastID);

    res.json(event);
}