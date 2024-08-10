// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const newUser = await User.create({ firstName, lastName, email, phone });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user's details
router.put('/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const user = await User.findByPk(req.params.id);

    if (user) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.phone = phone;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disable a user (soft delete)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy(); // Alternatively, use a "disabled" flag instead of destroying the record
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all users with optional filters
router.get('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.query;
    const whereClause = {};

    if (firstName) whereClause.firstName = firstName;
    if (lastName) whereClause.lastName = lastName;
    if (email) whereClause.email = email;
    if (phone) whereClause.phone = phone;

    const users = await User.findAll({ where: whereClause });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
