import React from 'react';

export default function TaskList({ tasks }) {
  if (!tasks.length) {
    return <p>No tasks found.</p>;
  }

  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id} style={{ marginBottom: 10 }}>
          <strong>{task.title}</strong> - {task.description} <br/>
          Status: {task.status}
        </li>
      ))}
    </ul>
  );
}
