import {db} from '@/lib/db';
import {useEffect, useState} from 'react';
import EventCard from './EventCard';
import Link from "next/link";

export default function Home({ initialEvents, user }) {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState('');

  const isAdmin = user?.role === 'admin';

  const deleteEvent = (eventToDelete, prevEvents) => {
    return prevEvents.filter((event) => event !== eventToDelete);
  };

  const handleDeleteEvent = (indexToDelete) => {
    const updatedEvents = deleteEvent(indexToDelete, events);
    setEvents(updatedEvents);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prevEvents) => {
      const index = prevEvents.findIndex(event => event.id === updatedEvent.id);
      const newEvents = [...prevEvents];
      newEvents[index] = updatedEvent;
      return newEvents;
    });
  };

  useEffect(() => {
    const filteredEvents = initialEvents.filter((event) =>
      event.title.toLowerCase().includes(filter.toLowerCase())
    );
    setEvents(filteredEvents);



  }, [filter]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
  };

  return (
    <div className="">
      <div className="bg-blue-500 flex items-center justify-center h-20 p-3">
        <div className="bg-blue-950 w-1/4 flex items-center justify-center rounded-md m-4 h-full">
          <h1 className="text-xl text-white">Event Website</h1>
        </div>

        <div className="w-3/4 grid grid-cols-3 m-4">
          { isAdmin && (
          <Link href="/CreateEventPage" className="h-full col-start-2 rounded-md bg-blue-950 m-2 mt-0 flex items-center justify-center text-white">Create Event</Link>
            )}
          <input className="col-start-3 rounded-md h-full m-2 mt-0" placeholder="Enter event name" value={filter} onChange={handleFilterChange}/>
        </div>

      </div>
      <div className='flex items-center justify-center text-3xl font-bold'>Welcome, {user?.email || 'Guest'} </div>
      <div className='flex items-center justify-center text-3xl font-bold'>Role {user?.role || 'Guest'} </div>
      <div className="text-3xl">Recent events</div>
      
        <div className='grid grid-cols-4 grid-flow-row'>
          {events.map((event) => (
              <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  price={event.price}
                  isAdmin={isAdmin} // Pass the isAdmin flag
                  handleDeleteEvent={handleDeleteEvent}  // Add this prop
                  handleUpdateEvent={handleUpdateEvent} // Pass the callback function
              />
          ))}
        </div>
     
    </div >
  )
}

export async function getServerSideProps(context) {
  const { req } = context;

  const session = req.cookies.session;
  let user = null;

  if (session) {
    const userSession = await db.get('SELECT user_id FROM sessions WHERE id = ?', session);

    if (userSession) {
      user = await db.get('SELECT id, email, role FROM users WHERE id = ?', userSession.user_id);
    }
  }

  const events = await db.all("SELECT * FROM events ORDER BY id DESC");

  return {
    props: {
      initialEvents: events,
      user: user || null,
    },
  };
}