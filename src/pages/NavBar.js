import Link from 'next/link';
import { useState } from 'react';

function NavBar(props)
{

    const [filter, setFilter] = useState('');

    const handleFilterChange = (event) => {
        const value = event.target.value;
        setFilter(value);
        props.onFilterChange(value);
    };

    return(
        <div className="bg-blue-500 flex items-center justify-center h-20 p-3">
            <div className="bg-blue-950 w-1/4 flex items-center justify-center rounded-md m-4 h-full">
                <h1 className="text-xl">{props.title}</h1>
            </div>
            <div className="w-3/4 grid grid-cols-3 m-4">
                <Link href="/CreateEventPage" className="h-full col-start-2 rounded-md bg-blue-950 m-2 mt-0 flex items-center justify-center">Create Event</Link>
                <input className="col-start-3 rounded-md h-full " placeholder="Enter event name" value={filter} onChange={handleFilterChange}/>
            </div>
        </div>
    );
}

export default NavBar;