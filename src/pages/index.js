import { db } from '@/lib/db';
import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import NavBar from './NavBar';

const deleteEvent = (eventToDelete, prevEvents) => {
  const updatedEvents = prevEvents.filter((event) => event !== eventToDelete);
  return updatedEvents;
};

const handleDeleteEvent = (indexToDelete) => {
  const updatedEvents = deleteEvent(indexToDelete, events);
  setEvents(updatedEvents);
};


export default function Home({ initialEvents, user }) {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const filteredEvents = initialEvents.filter((event) =>
      event.title.toLowerCase().includes(filter.toLowerCase())
    );
    setEvents(filteredEvents);



  }, [filter]);

  return (
    <div className="">
      <NavBar title="Event website" onFilterChange={(value) => setFilter(value) }/>
      <div className='flex items-center justify-center text-3xl font-bold'>Welcome, {user?.email || 'Guest'} </div>
      <div className='flex items-center justify-center text-3xl font-bold'>Role {user?.role || 'Guest'} </div>
      {/*<CreateEvent addEvent={(event) => setEvents([event, ...events])} />*/}
      <div className="text-3xl">Recent events</div>
      
        <div className='grid grid-cols-4 grid-flow-row'>
          {events.map((event) => (
            <EventCard key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              price={event.price}
              deleteEvent={{ handleDeleteEvent }} />
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
      user = await db.get('SELECT id, email FROM users WHERE id = ?', userSession.user_id);
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