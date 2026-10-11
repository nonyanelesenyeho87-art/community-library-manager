import { useState } from 'react';

function Login({ users = [] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [signedInName, setSignedInName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      setSignedInName('');
      setMessage('Email or password is incorrect.');
      return;
    }

    setSignedInName(user.name);
    setMessage(`Welcome, ${user.name}! You are signed in.`);
  }

  return (
    <main className="users-page">
      <header className="users-heading">
        <p className="dashboard-eyebrow">COMMUNITY LIBRARY</p>
        <h1>User login</h1>
        <p>Sign in with an account registered by the library.</p>
      </header>

      <section className="users-panel">
        <form className="users-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <div className="users-form-buttons">
            <button type="submit">Sign in</button>
          </div>

          {message && (
            <p role="status" className={signedInName ? 'transaction-success' : 'users-error'}>
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default Login;