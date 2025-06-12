import React, { useState } from 'react';
import { createUser } from '../api/userApi';

function UserForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await createUser(form);
    onAdd(user);
    setForm({ name: '', email: '', password: '', role: 'user' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="name" placeholder="Name" onChange={handleChange} value={form.name} className="input" />
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} className="input" />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} value={form.password} className="input" />
      <select name="role" onChange={handleChange} value={form.role} className="input">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button className="btn">Add User</button>
    </form>
  );
}

export default UserForm;
