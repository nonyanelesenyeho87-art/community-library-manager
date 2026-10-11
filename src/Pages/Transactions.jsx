import { useEffect, useState } from 'react';

function readTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem('library-transactions') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Transactions({ books = [], setBooks }) {
  const [bookId, setBookId] = useState('');
  const [type, setType] = useState('added');
  const [quantity, setQuantity] = useState('1');
  const [transactions, setTransactions] = useState(readTransactions);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('library-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const selectedBook = books.find((book) => book.id === bookId);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    const amount = Number(quantity);

    if (!selectedBook) {
      setError('Choose a book first.');
      return;
    }

    if (!Number.isInteger(amount) || amount < 1) {
      setError('Enter a whole number greater than zero.');
      return;
    }

    if (type === 'borrowed' && amount > Number(selectedBook.quantity)) {
      setError(`Only ${selectedBook.quantity} copies are available.`);
      return;
    }

    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === bookId
          ? {
              ...book,
              quantity:
                Number(book.quantity) + (type === 'added' ? amount : -amount),
            }
          : book
      )
    );

    const entry = {
      id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      bookTitle: selectedBook.title,
      type,
      quantity: amount,
      date: new Date().toISOString(),
    };

    setTransactions((current) => [entry, ...current]);
    setQuantity('1');
    setMessage(
      type === 'added'
        ? `Added ${amount} ${amount === 1 ? 'copy' : 'copies'} of ${selectedBook.title}.`
        : `Recorded ${amount} ${amount === 1 ? 'copy' : 'copies'} borrowed.`
    );
  }

  return (
    <main className="transactions-page">
      <header className="transactions-heading">
        <p className="dashboard-eyebrow">LIBRARY STOCK</p>
        <h1>Transactions</h1>
        <p>Record new arrivals and books borrowed from the library.</p>
      </header>

      <section className="transactions-panel">
        <h2>Update book stock</h2>

        {books.length === 0 ? (
          <p>No books are in the catalogue yet. Add a book before recording a transaction.</p>
        ) : (
          <form className="transactions-form" onSubmit={handleSubmit}>
            <label>
              Book
              <select
                value={bookId}
                onChange={(event) => setBookId(event.target.value)}
                required
              >
                <option value="">Choose a book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} — {book.quantity} available
                  </option>
                ))}
              </select>
            </label>

            <label>
              Transaction
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="added">Add stock received</option>
                <option value="borrowed">Record book borrowed</option>
              </select>
            </label>

            <label>
              Number of copies
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </label>

            {selectedBook && (
              <p className="transaction-available">
                Currently available: <strong>{selectedBook.quantity}</strong>
              </p>
            )}

            {error && <p className="transaction-error" role="alert">{error}</p>}
            {message && <p className="transaction-success" role="status">{message}</p>}

            <button className="transaction-button" type="submit">
              Save transaction
            </button>
          </form>
        )}
      </section>

      <section className="transactions-panel">
        <h2>Transaction history</h2>

        {transactions.length === 0 ? (
          <p>No transactions recorded yet.</p>
        ) : (
          <div className="transactions-table-wrap">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Copies</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.date).toLocaleString()}</td>
                    <td>{item.bookTitle}</td>
                    <td>{item.type === 'added' ? 'Stock received' : 'Borrowed'}</td>
                    <td>{item.quantity}</td>
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

export default Transactions;