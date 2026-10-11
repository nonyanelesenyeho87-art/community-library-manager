import { useState } from 'react';

const emptyBook = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  quantity: '0',
};

function Books({ books, setBooks }) {
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const duplicateIsbn = books.some(
      (book) =>
        book.isbn.trim().toLowerCase() === form.isbn.trim().toLowerCase() &&
        book.id !== editingId
    );

    if (duplicateIsbn) {
      setError('A book with that ISBN is already in the catalogue.');
      return;
    }

    const bookDetails = {
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      isbn: form.isbn.trim(),
      quantity: Number(form.quantity),
    };

    if (editingId) {
      setBooks(
        books.map((book) =>
          book.id === editingId ? { ...book, ...bookDetails } : book
        )
      );
    } else {
      const newBook = {
        id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
        ...bookDetails,
      };
      setBooks([...books, newBook]);
    }

    setForm(emptyBook);
    setEditingId(null);
  }

  function startEditing(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: String(book.quantity),
    });
    setError('');
  }

  function deleteBook(id) {
    if (window.confirm('Remove this book from the catalogue?')) {
      setBooks(books.filter((book) => book.id !== id));
    }
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyBook);
    setError('');
  }

  return (
    <main className="books-page">
      <header className="books-heading">
        <div>
          <p className="dashboard-eyebrow">LIBRARY CATALOGUE</p>
          <h1>Books</h1>
          <p>Add books and keep their availability up to date.</p>
        </div>
      </header>

      <section className="books-panel">
        <h2>{editingId ? 'Edit book' : 'Add a book'}</h2>

        <form className="books-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Author
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Genre
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            ISBN
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Initial quantity
            <input
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="books-error">{error}</p>}

          <div className="books-form-buttons">
            <button type="submit">
              {editingId ? 'Save changes' : 'Add book'}
            </button>

            {editingId && (
              <button type="button" className="cancel-button" onClick={cancelEditing}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="books-panel">
        <h2>Book list</h2>

        {books.length === 0 ? (
          <p className="books-empty">No books added yet.</p>
        ) : (
          <div className="books-table-wrap">
            <table className="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>
                    <td className="books-actions">
                      <button type="button" onClick={() => startEditing(book)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Books;