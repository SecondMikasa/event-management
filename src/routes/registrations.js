const express = require('express');
const router = express.Router();
const { validate, registerSchema } = require('../middleware/validate');
const regCtrl = require('../controllers/registrationController');

router.post('/register', validate(registerSchema), regCtrl.registerForEvent);
router.post('/cancel', validate(registerSchema), regCtrl.cancelRegistration);

module.exports = router;