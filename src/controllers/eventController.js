const Event = require('../models/Event');
const User = require('../models/User');

const createEvent = async (req, res) => {
  const { title, datetime, location, capacity } = req.body;
  try {
    const event = await Event.create(title, datetime, location, capacity);
    res.status(201).json({ eventId: event.id });
  } catch (err) {
    if (err.message.includes('capacity')) {
      return res.status(400).json({ error: 'Capacity must be between 1 and 1000' });
    }
    res.status(500).json({ error: 'Failed to create event' });
  }
};

const getEventDetails = async (req, res) => {
  const { id } = req.params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const registrations = await Event.getRegistrationCount(eventId);
  const users = await User.findRegisteredUsers(eventId); // Add method if needed

  // Get registered user details
  const userRes = await db.query(`
    SELECT u.id, u.name, u.email
    FROM users u
    JOIN registrations r ON u.id = r.user_id
    WHERE r.event_id = $1
  `, [eventId]);

  res.json({
    ...event,
    registrations: userRes.rows,
    totalRegistrations: registrations
  });
};

const listUpcomingEvents = async (_req, res) => {
  try {
    const events = await Event.findUpcoming();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

const getEventStats = async (req, res) => {
  const { id } = req.params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const total = await Event.getRegistrationCount(eventId);
  const remaining = event.capacity - total;
  const percentage = event.capacity > 0 ? Math.round((total / event.capacity) * 100) : 0;

  res.json({
    totalRegistrations: total,
    remainingCapacity: remaining,
    capacityUsedPercentage: percentage
  });
};

module.exports = {
  createEvent,
  getEventDetails,
  listUpcomingEvents,
  getEventStats
};