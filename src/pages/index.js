import { db } from '@/lib/db';
import { useState,  useEffect } from 'react';
import EventCard from './components/EventCard';
import { CreateEvent } from './CreateEventPage';


export function DeleteEvent({deleteEvent}) {

}

export default function Home( { initialEvents } ) {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
   
  }, [events]);

  return (
    <div className="p-2">
      <h1 className="text-3xl">My website</h1>
      <CreateEvent addEvent={(event) => setEvents([event, ...events])}/>
      <div className="text-3xl">Recent events</div>
      <div className='grid grid-cols-4 grid-flow-row'>
        
        {events.map((event) => (
          <EventCard key={event.id} 
          title={event.title} 
          description={event.description}
          date={event.date}
          price={event.price}/>
          
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
    const events = await db.all("SELECT * FROM events ORDER BY id DESC");
    return { props: { initialEvents: events, } };
}