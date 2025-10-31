import prisma from '../client.ts';
import { Note, Prisma } from '../generated/prisma/index.js';
import ApiError from '../utils/ApiError.ts';
import httpStatus from 'http-status';

/**
 * Create a note
 * @param {number} userId
 * @param {Object} noteData
 * @returns {Promise<Note>}
 */
const createNote = async (userId: number, noteData: { title: string; content: string }): Promise<Note> => {
    return await prisma.note.create({
        data: {
            title: noteData.title,
            content: noteData.content,
            userId
        }
    });
};

/**
 * Query notes for a user
 * @param {number} userId
 * @param {Object} filter - Query filters
 * @param {Object} options - Query options
 * @returns {Promise<{notes: Note[], total: number}>}
 */
const getNotes = async (
    userId: number,
    filter: {
        query?: string;
    },
    options: {
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
): Promise<{ notes: Note[]; total: number }> => {
    const where: Prisma.NoteWhereInput = {
        userId
    };

    // Add text search if query is provided
    if (filter.query) {
        where.OR = [
            { title: { contains: filter.query, mode: 'insensitive' } },
            { content: { contains: filter.query, mode: 'insensitive' } }
        ];
    }

    const sortBy = options.sortBy || 'updatedAt';
    const sortOrder = options.sortOrder || 'desc';

    // Get notes with filtering and sorting
    const notes = await prisma.note.findMany({
        where,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    // Get total count for the same filter
    const total = await prisma.note.count({ where });

    return { notes, total };
};

/**
 * Get note by id for a specific user
 * @param {string} noteId
 * @param {number} userId
 * @returns {Promise<Note | null>}
 */
const getNoteById = async (noteId: string, userId: number): Promise<Note | null> => {
    const note = await prisma.note.findUnique({
        where: { id: noteId }
    });

    if (!note) {
        return null;
    }

    // Check if note belongs to the user
    if (note.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden - note belongs to another user');
    }

    return note;
};

/**
 * Update note by id for a specific user
 * @param {string} noteId
 * @param {number} userId
 * @param {Object} updateData
 * @returns {Promise<Note>}
 */
const updateNote = async (
    noteId: string,
    userId: number,
    updateData: { title?: string; content?: string }
): Promise<Note> => {
    // First check if note exists and belongs to user
    const existingNote = await getNoteById(noteId, userId);
    if (!existingNote) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
    }

    return prisma.note.update({
        where: { id: noteId },
        data: updateData
    });
};

/**
 * Delete note by id for a specific user
 * @param {string} noteId
 * @param {number} userId
 * @returns {Promise<void>}
 */
const deleteNote = async (noteId: string, userId: number): Promise<void> => {
    // First check if note exists and belongs to user
    const existingNote = await getNoteById(noteId, userId);
    if (!existingNote) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
    }

    await prisma.note.delete({
        where: { id: noteId }
    });
};

export default {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
};
