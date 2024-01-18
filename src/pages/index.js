import { db } from '@/lib/db';
import { useState } from 'react';
function CreateEvent({addEvent}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <>
            <div>Title{" "} <input type="text" className="border" onChange={(event) => setTitle(event.target.value)} value={title}/></div>
            <div>Description{" "} <textarea className="border" onChange={(event) => setDescription(event.target.value)} value={description}/></div>
            <div>Date{" "} <input type="date" className="border" onChange={(event) => setDate(event.target.value)} value={date}/></div>
            <div>Price{" "} <input type="number" onChange={(event) => setPrice(event.target.value)} value={price}/></div>
            <button className="bg-blue-600 p-2 hover:bg-blue-700 text-white disabled:bg-gray-400" onClick={ async () => {
                try {
                    setLoading(true);
                    const res = await fetch('/api/createEvent', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({title, description, date, price}),
                    });
                    if(!res.ok) {
                        const { message } = await res.json();
                        throw new Error(message);
                    }
                    const event = await res.json();
                    addEvent(event);
                    setTitle('');
                    setDescription('');
                    setDate('');
                    setPrice('');
                } catch (err) {
                   setError(err.message);
                } finally {
                    setLoading(false);
                }
            }}
            disabled={!title || !description || !date || !price || loading}
            >{loading ? "Creating event..." : "Create"}</button>
            <div className="text-red-600">{error}</div>
        </>
    )
}

function DeleteEvent({deleteEvent}) {

}

export default function Home( { initialEvents } ) {
  const [events, setEvents] = useState(initialEvents);
  return (
    <div className="p-2">
      <h1 className="text-3xl">My website</h1>
      <CreateEvent addEvent={(event) => setEvents([event, ...events])}/>
      <div className="text-3xl">Recent events</div>
      <div>
        {events.map((event) => (
          <div key={event.id}>
            <h2 className="text-xl">{event.title}</h2>
            <p>{event.description}</p>
            <p>{event.date}</p>
            <p>{event.price}</p>
              <DeleteEvent deleteEvent={(event) => setEvents([event, ...events])}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
    const events = await db.all("SELECT * FROM events ORDER BY id DESC");
    return { props: { initialEvents: events, } };
}