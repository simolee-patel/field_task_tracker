import axios from 'axios';
const BASE_URL = import.meta.env.VITE_SERVER_URL + '/api/users';

export const getUsers = async () => (await axios.get(BASE_URL)).data;
export const createUser = async (user) => (await axios.post(BASE_URL, user)).data;