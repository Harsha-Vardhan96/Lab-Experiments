import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  // Fetch books on component mount and also after changes
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch("http://localhost:5000/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Add new book and refresh list
  const addBook = () => {
    if (!newTitle || !newAuthor) {
      alert("Please enter both title and author");
      return;
    }
    fetch("http://localhost:5000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, author: newAuthor }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchBooks();  // Refresh list after adding
        setNewTitle("");
        setNewAuthor("");
      });
  };

  // Start editing a book
  const startEdit = (book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
  };

  // Update book and refresh list
  const updateBook = () => {
    fetch(`http://localhost:5000/books/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, author: editAuthor }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchBooks();  // Refresh list after update
        setEditId(null);
        setEditTitle("");
        setEditAuthor("");
      });
  };

  // Delete book and refresh list
  const deleteBook = (id) => {
    fetch(`http://localhost:5000/books/${id}`, {
      method: "DELETE",
    }).then(() => fetchBooks());  // Refresh list after delete
  };

  return (
    <div>
      <h1>Book List</h1>

      {/* Add New Book Inputs */}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {editId === book.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                />
                <button onClick={updateBook}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {book.title} by {book.author}{" "}
                <button onClick={() => startEdit(book)}>Edit</button>{" "}
                <button onClick={() => deleteBook(book.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
