const Event = require('../models/Event');
const User = require('../models/User');

const registerForEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const now = new Date();
  const eventTime = new Date(event.datetime);
  if (eventTime < now) {
    return res.status(400).json({ error: 'Cannot register for past events' });
  }

  const isRegistered = await Event.isUserRegistered(userId, eventId);
  if (isRegistered) {
    return res.status(409).json({ error: 'User already registered' });
  }

  try {
    await Event.registerUser(userId, eventId);
    res.status(201).json({ message: 'Successfully registered' });
  } catch (err) {
    if (err.message === 'Event is full') {
      return res.status(400).json({ error: 'Event is full' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

const cancelRegistration = async (req, res) => {
  const { userId, eventId } = req.body;

  const wasRegistered = await Event.unregisterUser(userId, eventId);
  if (!wasRegistered) {
    return res.status(404).json({ error: 'Registration not found' });
  }
  res.json({ message: 'Registration cancelled' });
};

module.exports = { registerForEvent, cancelRegistration };