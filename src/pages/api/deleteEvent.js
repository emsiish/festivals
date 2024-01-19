import { db } from '@/lib/db';
export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        res.status(405).json({ message: "Only DELETE requests allowed" });
        return;
    }
    const title = req.body;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { lastID } = await db.run("DELETE FROM events WHERE title like ?", title);
    const event = await db.get("SELECT * FROM events WHERE id = ? ORDER BY id DESC LIMIT 1", lastID - 1);

    res.json(event);
}