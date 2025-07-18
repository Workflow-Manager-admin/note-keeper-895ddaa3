const notesService = require('../services/notes');

// PUBLIC_INTERFACE
/**
 * NotesController - REST API controller for the notes endpoints.
 */
class NotesController {
  // PUBLIC_INTERFACE
  /**
   * Create a new note.
   */
  async create(req, res, next) {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content required' });
      }
      const note = await notesService.createNote(title, content);
      return res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get a single note by ID.
   */
  async getById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const note = await notesService.getNote(id);
      if (!note) return res.status(404).json({ error: 'Note not found' });
      return res.json(note);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get all notes, optionally filtered by searchTerm (title or content).
   */
  async list(req, res, next) {
    try {
      const search = req.query.search || null;
      const notes = await notesService.listNotes(search);
      return res.json(notes);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update an existing note.
   */
  async update(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content required' });
      }
      const updated = await notesService.updateNote(id, title, content);
      if (!updated) return res.status(404).json({ error: 'Note not found' });
      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note by ID.
   */
  async delete(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await notesService.deleteNote(id);
      if (!deleted) return res.status(404).json({ error: 'Note not found' });
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotesController();
