const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksById,
} = require('../controllers/taskController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, isAdmin, createTask);

router.route('/:id')
  .get(protect,getTasksById)
  .put(protect, updateTask)
  .delete(protect, isAdmin, deleteTask);

module.exports = router;
