const express = require('express');
const router = express.Router();
const noteController = require('../Controllers/noteController');

router.post('/notes', noteController.createNote);
router.get('/notes', noteController.getNotes);
router.get('/notes/:id', noteController.getNoteById);
router.put('/notes/:id', noteController.updateNote);

module.exports = router;