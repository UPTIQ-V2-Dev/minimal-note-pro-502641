import { mockNoteResponse, mockNotes } from '@/data/mockData';
import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import type {
    Note,
    CreateNoteInput,
    UpdateNoteInput,
    NotesListResponse,
    NoteResponse,
    SearchNotesParams,
    DeleteNoteParams,
    GetNoteParams
} from '@/types/notes';

export const notesService = {
    getNotes: async (params?: SearchNotesParams): Promise<NotesListResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getNotes ---', params);
            await mockApiDelay();

            let filteredNotes = [...mockNotes];

            // Apply search filter
            if (params?.query) {
                const query = params.query.toLowerCase();
                filteredNotes = filteredNotes.filter(
                    note => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
                );
            }

            // Apply sorting
            if (params?.sortBy) {
                filteredNotes.sort((a, b) => {
                    const aValue = params.sortBy === 'title' ? a.title : new Date(a[params.sortBy!]).getTime();
                    const bValue = params.sortBy === 'title' ? b.title : new Date(b[params.sortBy!]).getTime();

                    if (params.sortBy === 'title') {
                        return params.sortOrder === 'desc'
                            ? (bValue as string).localeCompare(aValue as string)
                            : (aValue as string).localeCompare(bValue as string);
                    }

                    return params.sortOrder === 'desc'
                        ? (bValue as number) - (aValue as number)
                        : (aValue as number) - (bValue as number);
                });
            } else {
                // Default sort by updatedAt desc
                filteredNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            }

            return {
                notes: filteredNotes,
                total: filteredNotes.length
            };
        }

        const queryParams = new URLSearchParams();
        if (params?.query) queryParams.append('query', params.query);
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const response = await api.get(`/notes?${queryParams.toString()}`);
        return response.data;
    },

    getNote: async (params: GetNoteParams): Promise<NoteResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getNote ---', params);
            await mockApiDelay();
            return mockNoteResponse(params.id);
        }

        const response = await api.get(`/notes/${params.id}`);
        return response.data;
    },

    createNote: async (input: CreateNoteInput): Promise<NoteResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: createNote ---', input);
            await mockApiDelay();

            const newNote: Note = {
                id: Math.random().toString(36).substring(2, 15),
                title: input.title || 'Untitled Note',
                content: input.content || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Add to mock notes array
            mockNotes.unshift(newNote);

            return { note: newNote };
        }

        const response = await api.post('/notes', input);
        return response.data;
    },

    updateNote: async (id: string, input: UpdateNoteInput): Promise<NoteResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: updateNote ---', { id, input });
            await mockApiDelay();

            const noteIndex = mockNotes.findIndex(note => note.id === id);
            if (noteIndex === -1) {
                throw new Error(`Note with id ${id} not found`);
            }

            const updatedNote: Note = {
                ...mockNotes[noteIndex],
                ...input,
                updatedAt: new Date().toISOString()
            };

            mockNotes[noteIndex] = updatedNote;

            return { note: updatedNote };
        }

        const response = await api.put(`/notes/${id}`, input);
        return response.data;
    },

    deleteNote: async (params: DeleteNoteParams): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: deleteNote ---', params);
            await mockApiDelay();

            const noteIndex = mockNotes.findIndex(note => note.id === params.id);
            if (noteIndex === -1) {
                throw new Error(`Note with id ${params.id} not found`);
            }

            mockNotes.splice(noteIndex, 1);
            return;
        }

        await api.delete(`/notes/${params.id}`);
    }
};
