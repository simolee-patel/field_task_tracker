import React from 'react';

function UserList({ users }) {
  return (
    <ul className="list-disc pl-4">
      {users.map((user) => (
        <li key={user._id}>{user.name} ({user.email}) - {user.role}</li>
      ))}
    </ul>
  );
}

export default UserList;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 