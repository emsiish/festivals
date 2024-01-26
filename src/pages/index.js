import {db} from '@/lib/db';
import {useEffect, useState} from 'react';
import EventCard from './EventCard';
import NavBar from './NavBar';

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

  return (
    <div className="">
      <NavBar title="Event website" onFilterChange={(value) => setFilter(value) }/>
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