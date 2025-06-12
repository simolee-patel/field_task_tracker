import React, { useState } from 'react';
import { createTask } from '../api/taskApi';

function TaskForm({ onAdd }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'pending', assignedTo: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = await createTask(form);
    onAdd(task);
    setForm({ title: '', description: '', status: 'pending', assignedTo: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="title" placeholder="Title" onChange={handleChange} value={form.title} className="input" />
      <input name="description" placeholder="Description" onChange={handleChange} value={form.description} className="input" />
      <input name="assignedTo" placeholder="User ID to assign" onChange={handleChange} value={form.assignedTo} className="input" />
      <select name="status" onChange={handleChange} value={form.status} className="input">
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button className="btn">Add Task</button>
    </form>
  );
}

export default TaskForm;