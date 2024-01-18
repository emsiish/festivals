import { DeleteEvent } from "..";
import { MdDateRange } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";

function EventCard(props)
{
    return (
        <div className="bg-white rounded-md border-solid border-2 border-black m-4 p-4">
            <div className="flex items-center justify-center border-solid border-2 border-black rounded-md">
                <h2 className="text-xl font-bold">{props.title}</h2>
            </div>
            <p className="flex items-center justify-center">Event description: {props.description}</p>
            <div className="flex items-center justify-center">
                <MdDateRange />
                <p>Date: {props.date}</p>
            </div>
            <div className="flex items-center justify-center">
                <FaDollarSign />
                <p>Price: {props.price}</p>
            </div>
              <DeleteEvent deleteEvent={(event) => setEvents([event, ...events])}/>
            
        </div>
    )
}

export default EventCard;