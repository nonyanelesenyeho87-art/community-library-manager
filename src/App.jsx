import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard.jsx';
import Books from './Pages/Books.jsx';
import Transactions from './Pages/Transactions.jsx';
import Users from './Pages/Users.jsx';
import Login from './Pages/Login.jsx';

function readList(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function App() {
  const [books, setBooks] = useState(() => readList('library-books'));
  const [users, setUsers] = useState(() => readList('library-users'));

  useEffect(() => {
    localStorage.setItem('library-books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('library-users', JSON.stringify(users));
  }, [users]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard books={books} users={users} />}
      />
      <Route
        path="/books"
        element={<Books books={books} setBooks={setBooks} />}
      />
      <Route
        path="/transactions"
        element={<Transactions books={books} setBooks={setBooks} />}
      />
      <Route
        path="/users"
        element={<Users users={users} setUsers={setUsers} />}
      />
      <Route path="/login" element={<Login users={users} />}
      />
    </Routes>
  );
}

export default App;