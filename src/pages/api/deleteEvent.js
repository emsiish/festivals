import { db } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        res.status(405).json({ message: "Only DELETE requests allowed" });
        return;
    }

    const { title } = req.body;

    try {
        const eventToDelete = await db.get("SELECT * FROM events WHERE title LIKE ?", title);

        if (!eventToDelete) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        const { changes } = await db.run("DELETE FROM events WHERE title LIKE ?", title);

        if (changes > 0) {
            res.status(200).json(eventToDelete);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
