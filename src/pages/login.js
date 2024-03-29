import {useState} from "react";
import Link from 'next/link';
import {useRouter} from "next/router";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();
    const handleSubmit = async () => {
        event.preventDefault();
        try {
            setLoading(true);
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }
            await router.push("/");
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-500">
            <div className="bg-white p-8 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">Log in</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input type="text" className="border rounded-md w-full" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} value={email} />
                    </div>
                    <div className="mb-4">
                        <input type="password" className="border rounded-md w-full" placeholder="Enter password" onChange={(event) => setPassword(event.target.value)} value={password} />
                    </div>
                    <div className="mb-4 flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white disabled:bg-gray-400"
                            disabled={!email || !password || loading}
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </div>
                    <Link href="/register" className="text-blue-600">Dont have account?</Link>
                    <div className="text-red-600">{error}</div>
                </form>
            </div>
        </div>
    );
}