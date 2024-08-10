// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./models'); // Adjust the path as necessary

const app = express();
app.use(bodyParser.json());

// Register User
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update User
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete/Disable User
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ isActive: false });
    res.status(200).json({ message: 'User disabled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List All Users with Filters
app.get('/users', async (req, res) => {
  try {
    const filters = req.query;
    const users = await User.findAll({
      where: {
        ...filters
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = app;
