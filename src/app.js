const express = require('express');
const eventsRouter = require('./routes/events');
const registrationsRouter = require('./routes/registrations');

const app = express();
app.use(express.json());

app.use('/api/events', eventsRouter);
app.use('/api/registrations', registrationsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Event API running on port ${PORT}`);
});