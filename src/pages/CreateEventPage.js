import { useState } from 'react';

export default function CreateEvent({ addEvent }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/createEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date, price }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      const event = await res.json();
      addEvent((prevEvents) => [event, ...prevEvents]);
      setTitle('');
      setDescription('');
      setDate('');
      setPrice('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500">
      <div className="bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input type="text" className="border rounded-md w-full" placeholder="Enter title" onChange={(event) => setTitle(event.target.value)} value={title} />
          </div>
          <div className="mb-4">
            <textarea className="border rounded-md w-full" placeholder="Enter description" onChange={(event) => setDescription(event.target.value)} value={description} />
          </div>
          <div className="mb-4">
            <input type="date" className="border rounded-md w-full" onChange={(event) => setDate(event.target.value)} value={date} />
          </div>
          <div className="mb-4">
            <input type="number" className="border rounded-md w-full" placeholder="Enter price" onChange={(event) => setPrice(event.target.value)} value={price} />
          </div>
          <div className="mb-4 flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white disabled:bg-gray-400"
              disabled={!title || !description || !date || !price || loading}
            >
              {loading ? "Creating event..." : "Create"}
            </button>
          </div>
          <div className="text-red-600">{error}</div>
        </form>
      </div>
    </div>
  );
}
