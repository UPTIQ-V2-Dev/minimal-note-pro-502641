import { notesService } from '../services/index.ts';
import ApiError from '../utils/ApiError.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import pick from '../utils/pick.ts';
import httpStatus from 'http-status';

const createNote = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const { title, content } = req.body;
    const note = await notesService.createNote(userId, { title, content });
    res.status(httpStatus.CREATED).send({ note });
});

const getNotes = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const filter = pick(req.validatedQuery, ['query']);
    const options = pick(req.validatedQuery, ['sortBy', 'sortOrder']);
    const result = await notesService.getNotes(userId, filter, options);
    res.send(result);
});

const getNoteById = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    const note = await notesService.getNoteById(noteId, userId);
    if (!note) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
    }
    res.send({ note });
});

const updateNote = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    const updateData = pick(req.body, ['title', 'content']);
    const note = await notesService.updateNote(noteId, userId, updateData);
    res.send({ note });
});

const deleteNote = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    await notesService.deleteNote(noteId, userId);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
};
