import { db } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== "PATCH") {
        res.status(405).json({ message: "Only PATCH requests allowed" });
        return;
    }

    const { title, description, date, price, id } = req.body;

    try {
        const { changes } = await db.run("UPDATE events SET title = ?, description = ?, date = ?, price = ? WHERE id = ? ", [title, description, date, price, id]);

        if (changes > 0) {
            const updatedEvent = await db.get("SELECT * FROM events WHERE id = ?", id);
            res.status(200).json(updatedEvent);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
