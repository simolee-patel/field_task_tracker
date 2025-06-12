import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL + '/api/tasks';

export const getTasks = async () => (await axios.get(BASE_URL)).data;
export const createTask = async (task) => (await axios.post(BASE_URL, task)).data;
