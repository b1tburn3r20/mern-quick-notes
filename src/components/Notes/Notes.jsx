import React, { useState, useEffect } from 'react';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [newNoteText, setNewNoteText] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    // Fetch notes
    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/notes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setNotes(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (event) => {
        setNewNoteText(event.target.value);
    };

    // Add note
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: newNoteText }),
            });
            const data = await res.json();
            setNewNoteText('');
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    // Delete note
    const handleDelete = async (noteId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newNoteText}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Add Note</button>
            </form>
            {notes.length === 0 ? (
                <p>No Notes Yet!</p>
            ) : (
                notes.map((note) => (
                    <div key={note._id}>
                        <p>{note.text}</p>
                        <p>{new Date(note.createdAt).toLocaleString()}</p>
                        <button onClick={() => handleDelete(note._id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notes;
