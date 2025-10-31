import { notesService } from "../services/index.js";
import pick from "../utils/pick.js";
import { z } from 'zod';
const noteSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.number()
});
const createNoteTool = {
    id: 'notes_create',
    name: 'Create Note',
    description: 'Create a new note for the authenticated user',
    inputSchema: z.object({
        userId: z.number().int(),
        title: z.string().min(1),
        content: z.string().min(1)
    }),
    outputSchema: noteSchema,
    fn: async (inputs) => {
        const note = await notesService.createNote(inputs.userId, {
            title: inputs.title,
            content: inputs.content
        });
        return note;
    }
};
const getNotesTool = {
    id: 'notes_get_all',
    name: 'Get All Notes',
    description: 'Get all notes for a user with optional filtering and sorting',
    inputSchema: z.object({
        userId: z.number().int(),
        query: z.string().optional(),
        sortBy: z.enum(['title', 'content', 'createdAt', 'updatedAt']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional()
    }),
    outputSchema: z.object({
        notes: z.array(noteSchema),
        total: z.number()
    }),
    fn: async (inputs) => {
        const filter = pick(inputs, ['query']);
        const options = pick(inputs, ['sortBy', 'sortOrder']);
        const result = await notesService.getNotes(inputs.userId, filter, options);
        return result;
    }
};
const getNoteByIdTool = {
    id: 'notes_get_by_id',
    name: 'Get Note By ID',
    description: 'Get a specific note by its ID for a user',
    inputSchema: z.object({
        userId: z.number().int(),
        noteId: z.string().min(1)
    }),
    outputSchema: noteSchema,
    fn: async (inputs) => {
        const note = await notesService.getNoteById(inputs.noteId, inputs.userId);
        if (!note) {
            throw new Error('Note not found');
        }
        return note;
    }
};
const updateNoteTool = {
    id: 'notes_update',
    name: 'Update Note',
    description: 'Update a note by ID for a user',
    inputSchema: z.object({
        userId: z.number().int(),
        noteId: z.string().min(1),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional()
    }),
    outputSchema: noteSchema,
    fn: async (inputs) => {
        const updateData = pick(inputs, ['title', 'content']);
        const note = await notesService.updateNote(inputs.noteId, inputs.userId, updateData);
        return note;
    }
};
const deleteNoteTool = {
    id: 'notes_delete',
    name: 'Delete Note',
    description: 'Delete a note by ID for a user',
    inputSchema: z.object({
        userId: z.number().int(),
        noteId: z.string().min(1)
    }),
    outputSchema: z.object({
        success: z.boolean()
    }),
    fn: async (inputs) => {
        await notesService.deleteNote(inputs.noteId, inputs.userId);
        return { success: true };
    }
};
export const notesTools = [createNoteTool, getNotesTool, getNoteByIdTool, updateNoteTool, deleteNoteTool];
