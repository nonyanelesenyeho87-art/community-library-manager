import { useState } from 'react';

const emptyUser = {
  name: '',
  membershipId: '',
  role: 'member',
  email: '',
  password: '',
};

function Users({ users = [], setUsers }) {
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const duplicateId = users.some(
      (user) =>
        user.membershipId.toLowerCase() ===
          form.membershipId.trim().toLowerCase() &&
        user.id !== editingId
    );

    const duplicateEmail = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.trim().toLowerCase() &&
        user.id !== editingId
    );

    if (duplicateId) {
      setError('That membership ID is already in use.');
      return;
    }

    if (duplicateEmail) {
      setError('That email address is already in use.');
      return;
    }

    if (editingId) {
      const oldUser = users.find((user) => user.id === editingId);
      const updatedUser = {
        ...oldUser,
        ...form,
        name: form.name.trim(),
        membershipId: form.membershipId.trim(),
        email: form.email.trim(),
        password: form.password || oldUser.password,
      };

      setUsers(
        users.map((user) => (user.id === editingId ? updatedUser : user))
      );
    } else {
      const newUser = {
        ...form,
        id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
        name: form.name.trim(),
        membershipId: form.membershipId.trim(),
        email: form.email.trim(),
      };

      setUsers([...users, newUser]);
    }

    setForm(emptyUser);
    setEditingId(null);
  }

  function startEditing(user) {
    setEditingId(user.id);
    setForm({ ...user, password: '' });
    setError('');
  }

  function deleteUser(id) {
    if (window.confirm('Remove this user from the library?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyUser);
    setError('');
  }

  return (
    <main className="users-page">
      <header className="users-heading">
        <p className="dashboard-eyebrow">YOUR COMMUNITY</p>
        <h1>User management</h1>
        <p>Add readers and manage library accounts.</p>
      </header>

      <section className="users-panel">
        <h2>{editingId ? 'Edit user' : 'Add a user'}</h2>

        <form className="users-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Membership ID
            <input
              name="membershipId"
              value={form.membershipId}
              onChange={handleChange}
              placeholder="e.g. MEM-001"
              required
            />
          </label>

          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="member">Member</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Administrator</option>
            </select>
          </label>

          <label>
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {editingId ? 'New password (optional)' : 'Password'}
            <input
              name="password"
              type="password"
              minLength="6"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
              placeholder={editingId ? 'Leave blank to keep current password' : ''}
            />
          </label>

          {error && <p className="users-error" role="alert">{error}</p>}

          <div className="users-form-buttons">
            <button type="submit">
              {editingId ? 'Save changes' : 'Add user'}
            </button>

            {editingId && (
              <button
                type="button"
                className="users-cancel-button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="users-panel">
        <div className="users-list-heading">
          <h2>Library users</h2>
          <span>{users.length} total</span>
        </div>

        {users.length === 0 ? (
          <p className="users-empty">No users added yet.</p>
        ) : (
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Membership ID</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.membershipId}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    <td className="users-actions">
                      <button type="button" onClick={() => startEditing(user)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="users-delete-button"
                        onClick={() => deleteUser(user.id)}
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

      <p className="users-note">
        This classroom demo stores account details in this browser’s local storage.
      </p>
    </main>
  );
}

export default Users;