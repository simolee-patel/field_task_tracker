import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/userApi';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <UserForm onAdd={(u) => setUsers((prev) => [...prev, u])} />
      <UserList users={users} />
    </div>
  );
}

export default UsersPage;