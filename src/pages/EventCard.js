import { MdDateRange } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import { useState } from 'react';


function EventCard(props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState("");
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [error, setError] = useState(null);

    const handleDeleteSubmit = async () => {
        try {
            setLoadingDelete(true);
            const res = await fetch('/api/deleteEvent', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: props.title }),
            });

            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }

            await props.handleDeleteEvent(props.title);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleEditSubmit = async () => {
        let id = props.id;
        try {
            setLoadingUpdate(true);
            const res = await fetch('/api/updateEvent', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, date, price, id })
            });
            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }
            const updatedEvent = await res.json();

            props.handleUpdateEvent(updatedEvent);


            setTitle('');
            setDescription('');
            setDate('');
            setPrice('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingUpdate(false);
        }
    };



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
            <div>
                <form onSubmit={handleDeleteSubmit}>
                    <div className="mb-4 flex items-center justify-center">
                        {props.isAdmin && (
                            <button
                                type="submitdelete"
                                className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white disabled:bg-gray-400"
                                disabled={loadingDelete}
                            >
                                {loadingDelete ? "Deleting event..." : "Delete"}
                            </button>
                        )}
                    </div>
                    <div className="text-red-600">{error}</div>
                </form>
                {props.isAdmin && (
                <form onSubmit={handleEditSubmit}>
                    <div className="mb-4">
                        <input type="text" className="border rounded-md w-full" placeholder="Enter new title" onChange={(event) => setTitle(event.target.value)} value={title} />
                    </div>
                    <div className="mb-4">
                        <textarea className="border rounded-md w-full" placeholder="Enter new description" onChange={(event) => setDescription(event.target.value)} value={description} />
                    </div>
                    <div className="mb-4">
                        <input type="date" className="border rounded-md w-full" onChange={(event) => setDate(event.target.value)} value={date} />
                    </div>
                    <div className="mb-4">
                        <input type="number" className="border rounded-md w-full" placeholder="Enter new price" onChange={(event) => setPrice(event.target.value)} value={price} />
                    </div>
                    <div className="mb-4 flex items-center justify-center">
                            <button
                                type="submitedit"
                                className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white disabled:bg-gray-400"
                                disabled={loadingUpdate}
                            >
                                {loadingUpdate ? "Editing event..." : "Edit"}
                            </button>
                    </div>
                    <div className="text-red-600">{error}</div>
                </form>)}
            </div>
        </div>
    )
}

export default EventCard;