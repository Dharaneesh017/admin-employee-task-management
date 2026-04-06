const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/tasks
// @desc    Create a new task (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;
    const task = await Task.create({
      title,
      description,
      assignedTo,
      deadline,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks for admin, or assigned tasks for employee
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find({}).populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id });
    }
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task status (Employee) OR all fields (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'admin') {
      const { title, description, assignedTo, deadline, status } = req.body;
      task.title = title || task.title;
      task.description = description || task.description;
      task.assignedTo = assignedTo || task.assignedTo;
      task.deadline = deadline || task.deadline;
      task.status = status || task.status;
    } else {
      // Employee can only update status
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this task' });
      }
      task.status = req.body.status || task.status;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
