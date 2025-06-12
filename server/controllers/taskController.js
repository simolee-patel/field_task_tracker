const { default: mongoose } = require('mongoose');
const Task = require('../models/TaskModel');
const { mqttClient } = require('../server');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasksById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find all tasks assigned to this user
    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name email'); // show user info

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can create tasks' });
    }

    let task = await Task.create(req.body);
    task = await task.populate('assignedTo', 'name email');

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // mqttClient.publish('tasks/updates', JSON.stringify({ action: 'update', task }));
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
