import { db } from '@/lib/db';
export default async function handler(req, res) {
    if(req.method !== "DELETE") {
        res.status(405).json({ message: "Only DELETE requests allowed" });
        return;
    }
}