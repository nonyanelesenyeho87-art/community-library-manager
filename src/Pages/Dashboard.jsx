import { Link } from 'react-router-dom';

function Dashboard({ books = [], users = [] }) {
  const totalCopies = books.reduce(
    (total, book) => total + Number(book.quantity || 0),
    0
  );
  const lowStock = books.filter(
    (book) => Number(book.quantity || 0) < 2
  ).length;

  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">COMMUNITY LIBRARY</p>
          <h1>Your library at a glance</h1>
          <p className="dashboard-subtitle">
            Keep track of your shelves and the readers in your community.
          </p>
        </div>

        <div className="dashboard-header-right">
          <span className="dashboard-date">{today}</span>
          <Link className="dashboard-button" to="/books">
            + Add a book
          </Link>
        </div>
      </header>

      <section className="dashboard-cards" aria-label="Library summary">
        <article className="dashboard-card card-green">
          <span className="card-icon">▤</span>
          <p className="card-label">Book titles</p>
          <strong>{books.length}</strong>
          <span className="card-note">Different titles in your catalogue</span>
        </article>

        <article className="dashboard-card">
          <span className="card-icon card-icon-gold">▣</span>
          <p className="card-label">Copies available</p>
          <strong>{totalCopies}</strong>
          <span className="card-note">Ready for someone to borrow</span>
        </article>

        <article className="dashboard-card">
          <span className="card-icon card-icon-rose">⌁</span>
          <p className="card-label">Low stock</p>
          <strong>{lowStock}</strong>
          <span className="card-note">Titles with fewer than 2 copies</span>
        </article>

        <article className="dashboard-card">
          <span className="card-icon card-icon-blue">♙</span>
          <p className="card-label">Library users</p>
          <strong>{users.length}</strong>
          <span className="card-note">Members and library staff</span>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <p className="dashboard-eyebrow">YOUR COLLECTION</p>
            <h2>Book availability</h2>
          </div>
          <Link className="dashboard-text-link" to="/books">
            Manage books <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Copies</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td className="dashboard-empty" colSpan="5">
                    No books added yet. Use “Add a book” to start your catalogue.
                  </td>
                </tr>
              ) : (
                books.map((book) => {
                  const quantity = Number(book.quantity || 0);
                  const status =
                    quantity === 0
                      ? 'Out of stock'
                      : quantity < 2
                        ? 'Low stock'
                        : 'Available';

                  return (
                    <tr key={book.id}>
                      <td className="dashboard-book-title">{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{quantity}</td>
                      <td>
                        <span
                          className={`stock-badge ${
                            quantity === 0
                              ? 'stock-out'
                              : quantity < 2
                                ? 'stock-low'
                                : 'stock-available'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="dashboard-footer">
        A good library is built one book and one reader at a time.
      </p>
    </main>
  );
}

export default Dashboard;