import { db } from '@/lib/db';
export default async function handler(req, res) {
    if (req.method !== "PATCH") {
        res.status(405).json({ message: "Only PATCH requests allowed" });
        return;
    }
    let { title, description, date, price, id } = req.body;
    const event = await db.get("SELECT * FROM events WHERE id = ?", id);
    console.log(req.body)
    console.log(event)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (title === "") {
        title = event.title
    }
    if (description === "") {
        description = event.description
    }
    if (price == "") {
        price = event.price
    }

    const { lastID } = await db.run("UPDATE events SET title = ?, description = ?, date = ?, price = ? WHERE id = ? ", [title, description, date, price, id]);

    res.json(event);
}