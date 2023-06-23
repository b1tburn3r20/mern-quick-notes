const express = require('express');
const router = express.Router();
const Note = require('../../models/notes');
const checkAuthenticated = require('../../config/ensureLoggedIn');

// Create a note
router.post('/', checkAuthenticated, async (req, res) => {
    req.body.user = req.user._id;
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all notes for a user
router.get('/', checkAuthenticated, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a note
router.put('/:id', checkAuthenticated, async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (note) {
            res.status(200).json(note);
        } else {
            res.status(404).json({ message: "Note not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a note
router.delete('/:id', checkAuthenticated, async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndRemove({ _id: req.params.id, user: req.user._id });
        if (deletedNote) {
            res.status(200).json(deletedNote);
        } else {
            res.status(404).json({ message: "Note not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
