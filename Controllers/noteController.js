const Note = require('../Model/noteModel');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ status: false, message: "Title and content are required." });
    }

    const note = new Note({ title, content });
    await note.save();

    res.status(201).json({ status: true, message: "Note created successfully!", data: note });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    if (!notes || notes.length === 0) {
      return res.status(404).json({ status: false, message: "No notes found." });
    }

    res.status(200).json({ status: true, message: "Notes fetched successfully!", data: notes });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

// Get note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ status: false, message: "Note not found with given ID." });
    }

    res.status(200).json({ status: true, message: "Note fetched successfully!", data: note });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const {id} = req.params;
    const { title, content } = req.body;

    if (!title && !content || !id) {
      return res.status(400).json({ status: false, message: "At least one field (title or content) & id is required to update." });
    }

    const note = await Note.findByIdAndUpdate(id, {title ,content}, { new: true });

    if (!note) {
      return res.status(404).json({ status: false, message: "Note not found with given ID." });
    }

    res.status(200).json({ status: true, message: "Note updated successfully!", data: note });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};
