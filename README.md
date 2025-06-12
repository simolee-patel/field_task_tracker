# 🧠 Real-Time Task Manager

A real-time task management system that allows **admins** to assign tasks to users and **users** to update task statuses. Built with **React**, **Node.js**, **MongoDB**, **Socket.IO**, and **Material UI**.

---

## 🚀 Features

- 🧑‍💼 **Admin Panel**: Admins can create, assign, filter, and delete tasks.
- 👷 **User Dashboard**: Users can view their assigned tasks and update statuses (`Pending`, `In Progress`, `Completed`).
- 🔐 **Role-Based Access**: Distinct access control for admins and users using JWT.
- ⚡ **Real-Time Updates**: Instant task creation, status updates, and deletions across all clients using Socket.IO.
- 🖌️ **Material UI Design**: Clean, responsive, and mobile-friendly UI.

---

## 🛠️ Tech Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Frontend    | React, Material UI       |
| Backend     | Node.js, Express.js      |
| Real-Time   | Socket.IO                |
| Database    | MongoDB + Mongoose       |
| Auth        | JWT (JSON Web Token)     |

---

## 📡 Real-Time Functionality (Socket.IO)

- All clients connect via **Socket.IO**
- Server emits events:
  - `taskCreated`
  - `taskUpdated`
  - `taskDeleted`
- Frontend listens for changes and updates UI live without needing page refresh.

---

## 📸 Screenshots

> _(Click on the images to view full-size on Google Drive)_

### User Dashboard  
[![Admin Panel](https://drive.google.com/thumbnail?id=1b28ounxG7g0QSlXHFM-nAj3bkxq14UVD)](https://drive.google.com/file/d/1b28ounxG7g0QSlXHFM-nAj3bkxq14UVD/view?usp=sharing)

### Admin Dashboard  
[![Task Creation](https://drive.google.com/thumbnail?id=1hD86Mq0lI7Ysxl-bxjvMknVC8hAc79Wv)](https://drive.google.com/file/d/1hD86Mq0lI7Ysxl-bxjvMknVC8hAc79Wv/view?usp=sharing)

### Login
[![User Dashboard](https://drive.google.com/thumbnail?id=1cQi0y78Dpja_x97GZd2Ts4a7M8KU0BRg)](https://drive.google.com/file/d/1cQi0y78Dpja_x97GZd2Ts4a7M8KU0BRg/view?usp=sharing)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/realtime-task-manager.git
cd realtime-task-manager
