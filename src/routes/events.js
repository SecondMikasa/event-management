const express = require('express');
const router = express.Router();
const { validate, createEventSchema } = require('../middleware/validate');
const eventCtrl = require('../controllers/eventController');

router.post('/', validate(createEventSchema), eventCtrl.createEvent);
router.get('/:id', eventCtrl.getEventDetails);
router.get('/', eventCtrl.listUpcomingEvents);
router.get('/:id/stats', eventCtrl.getEventStats);

module.exports = router;